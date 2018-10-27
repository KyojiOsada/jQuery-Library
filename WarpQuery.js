/**
 * for WARP Query Parser
 *
 * @author Kyoji Osada at WARP-WG
 * @copyright 2017 WARP-WG
 * @license Apache-2.0
 * @version 0.1.0
 * @date 2018-04:20 UTC
 */
class WarpQuery
{

	/**
	 * coustructor
	 *
	 * @param void
	 * @return void
	 */
	constructor()
	{
		this.operators = [';', '&', '|', '^', '==', '!=', '><', '<<', '>>', '<>', '.ij.', '.lj.', '.rj.', '.cj.', '>=', '<=', '>', '<', '?=', ':=', '.ge.', '.le.', '.gt.', '.lt.', '%3E%3E', '%3C%3C', '%3E%3C', '%3C%3E', '%3E=', '%3C=', '%3E', '%3C', '='];
		this.central_operators = ['==', '!=', '><', '<<', '>>', '<>', '>=', '<=', '>', '<', '?=', ':=', '='];
		this.compare_operators = ['==', '!=', '>=', '<=', '>', '<', '?='];
		this.logical_operators = ['&', '|', '^'];
		this.join_operators = ['><', '<<', '>>', '<>'];
	}


	/**
	 * decode Pion Query to Pion Object
	 *
	 * @param string $_query Pion Query
	 * @return array $queries Pion Object
	 */
	decode(_query = null)
	{
		// check Empty Query String
		if (_query === null) {
			return [];
		}

		// form Query String for Parsing
		var query_string = '&' + _query + ';';

		var queries = [];
		// for Proxy Parameters
		while (true) {
			// check Curly Brackets
			var matches = query_string.match('^(?:|(.*?)([&|]))({.*?[^%]})(.*)$');
			if (matches === null) {
				break;
			}

			// to Semantics Variables
			var all_match = matches[0];
			var pre_match = matches[1];
			var process = matches[2];
			var proxy = matches[3];
			var post_match = matches[4];

			// delete Curly Brackets
			proxy = proxy.replace(/^{(.*)}$/, '$1');

			var host = null;
			// for Virtical Proxy Module
			if (0 === proxy.indexOf('/')) {
				host = 'self';
			// for Horizontal Proxy Module
			} else if (host = proxy.match(/^(http(?:|s):\/\/.+?)\//i)) {
				host = host[1];
				proxy = proxy.replace(host, '');
			// for Others
			} else {
				throw new SyntaxError('The Proxy Parameters are having unknown URL scheme: ' + proxy);
			}

			// to Objects
			queries.push([
				process,
				host,
				'{}',
				proxy,
			]);

			// reform Query String for Parsing
			query_string = pre_match + post_match;
		}

		// escape Operators
		var esc_operators = [];
		var len = this.operators.length;
		for (var i = 0; i < len; i++) {
			esc_operators[i] = this.operators[i].replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:])/g, "\\$1");
		}

		// form Operators Regex
		var operator_regex = new RegExp('^(.*?)(' + esc_operators.join('|') + ')(.*?)$', 'i');

		// from Query to Parts
		var query_parts = [];
		while (true) {

			// match Operators
			var matches = query_string.match(operator_regex);
			if (matches === null) {
				break;
			}

			// to Semantics Variables
			var all_match = matches[0];
			var operand = matches[1];
			var operator = matches[2];
			var post_match = matches[3];

			// from Alias Operators to Master Operators
			if (operator === '.ge.' || operator === '%3E=') {
				operator = '>=';
			} else if (operator === '.le.' || operator === '%3C=') {
				operator = '<=';
			} else if (operator === '.gt.' || operator === '%3E') {
				operator = '>';
			} else if (operator === '.lt.' || operator === '%3C') {
				operator = '<';
			} else if (operator === '.ij.' || operator === '%3E%3C') {
				$operator = '><';
			} else if (operator === '.lj.' || operator === '%3C%3C') {
				operator = '<<';
			} else if (operator === '.rj.' || operator === '%3E%3E') {
				$operator = '>>';
			} else if (operator === '.cj.' || operator === '%3C%3E') {
				operator = '<>';
			}

			// map to Query Parts
			if (operand !== '') {
				query_parts.push(operand);
			}
			query_parts.push(operator);

			// from Post Matcher to Query String
			query_string = post_match;
		}

		// check Data-Type-Head Module
		var len = query_parts.length;
		var data_type_id = false;
		for (i = 0; i < len; i++) {
			if (query_parts[i] !== 'data-type') {
				continue;
			}
			data_type_id = i;
			break;
		}

		var data_type = null;
		if ((false !== data_type_id) && (query_parts[data_type_id + 1] === ':=')) {
			data_type = query_parts[data_type_id + 2];
		}

		// map to Queries
		len = query_parts.length;
		for (var i = 0; i < len; i++) {
			var query_part = query_parts[i];

			// not NV Operators
			if (-1 === this.central_operators.indexOf(query_part)) {
				continue;
			}

			// to Semantics Variables
			var logical_operator = query_parts[i - 2];
			var left_operand = query_parts[i - 1];
			var central_operator = query_part;
			var right_operand = query_parts[i + 1];

			// for Data-Type-Head Module
			// for Strict Data Type
			if (data_type === 'true') {
				regex = '^%(?:22|27|["\'])(.*?)%(?:22|27|["\'])$';
				// delete first and last quotes for String Data Type
				if (right_operand.preg_match(regex)) {
					right_operand = right_operand.replace(regex, '$1');
				// for Not String Type
				} else {
					// to Boolean
					if (right_operand === 'true') {
						right_operand = true;
					// to Boolean
					} else if (right_operand === 'false') {
						right_operand = false;
					// to Null
					} else if (right_operand === 'null') {
						right_operand = null;
					// to Integer
					} else if (right_operand.match(/^\d$|^[1-9]\d+$/)) {
						right_operand = parseInt(right_operand);
					// to Float
					} else if (right_operand.match(/^\d\.\d+$|^[1-9]\d+\.\d+$/)) {
						right_operand = parseFloat(right_operand);
					}
				}
			}

			// validate Left Operand
			if (-1 !== this.operators.indexOf(left_operand)) {
				throw new SyntaxError('The parameter is having invalid left operands: ' + _query);
			}

			// validate Right Operand
			// to Empty String
			if (-1 !== this.logical_operators.indexOf(right_operand) || right_operand === ';') {
				right_operand = '';
			// for Double Central Operators
			} else if (-1 !== this.central_operators.indexOf(right_operand)) {
				throw new SyntaxError('The parameter is having double comparing operators: ' + _query);
			}

			// map to Queries
			switch (true) {
				// for Head Parameters
				case central_operator === ':=':
					// validate Logical Part
					if (logical_operator !== '&') {
						throw new SyntaxError('The Head Parameters must be a “and” logical operator: ' + _query);
					}

					// to Heads
					queries.push([
						logical_operator,
						left_operand,
						central_operator,
						right_operand,
					]);
					break;
				// for Assign Parameters
				case central_operator === '=':
					// validate Logical Part
					if (logical_operator !== '&') {
						throw new SyntaxError('The Assign Parameters must be a “&” logical operator: ' + _query);
					}

					// to Assigns
					queries.push([
						logical_operator,
						left_operand,
						central_operator,
						right_operand,
					]);
					break;
				// for Join Parameters
				case -1 !== this.join_operators.indexOf(central_operator):
					// validate Logical Part
					if (logical_operator !== '&') {
						throw new SyntaxError('The Join Parameters must be a “&” logical operator: ' + _query);
					}

					// to Joins
					queries.push([
						logical_operator,
						left_operand,
						central_operator,
						right_operand,
					]);
					break;
				// for Search Parameters
				case -1 !== this.compare_operators.indexOf(central_operator):
					// validate Logical Part
					if (-1 === this.logical_operators.indexOf(logical_operator)) {
						throw new SyntaxError('The Search Parameters are having invalid logical operators: ' + _query);
					}

					// to Searches
					queries.push([
						logical_operator,
						left_operand,
						central_operator,
						right_operand,
					]);
					break;
				// for Others
				default:
					break;
			}
		}

		// init Searches 1st Logical Operator
		queries[0][0] = '';

		// return
		return queries;
	}


	/**
	 * encode Pion Object to Pion Query
	 *
	 * @param array $_object Pion Object
	 * @return string $query Pion Query
	 */
	encode(_object = null)
	{
		// check Empty Object
		if (_object === null) {
			return '';
		}

		// empty First Logical Operator
		if (_object[0][0] !== '') {
			_object[0][0] = '';
		}

		// check Data Type Flag
		var data_type_flag = false;
		for (var i in _object) {
			i = parseInt(i);
			var list = _object[i];
			for (var j in list) {
				j = parseInt(j);
				var value = list[j];
				// for Not Data Type
				if (value !== 'data-type') {
					continue;
				}

				// for Data Type
				// Notice: Processing must be not breaked because there ware multiple the value of “data-type”.
				if (_object[i][j + 2] === true) {
					data_type_flag = true;
				}
			}
		}

		// to Query String
		var query_string = '';
		for (var i in _object) {
			i = parseInt(i);
			var list = _object[i];

			if (list[2] === '{}') {
				list[1] = list[1] === 'self' ? '' : list[1];
				list[1] = '{' + list[1];
				list[2] = '';
				list[3] = list[3] + '}';
			}

			for (var j in list) {
				j = parseInt(j);
				var value = list[j];

				// for Stric Data Type
				if (data_type_flag) {
					// for Value of Strint Type
					if (j === 3) {
						if (typeof value === 'string') {
							value = "'" + value + "'";
						}
					}
				}

				// for Value of Boolean and Null Type
				if (j === 3) {
					if (value === true) {
						value = 'true';
					} else if (value === false) {
						value = 'false';
					} else if (value === null) {
						value = 'null';
					}
				}

				// to Query String
				query_string += value;
			}
		}

		// return
		return query_string;
	}

}
