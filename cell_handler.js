var Act =
{
	//* Objective Property Init
	border_style: '1px solid #00C000',
	start_elem: null,
	start_cell: null,
	start_tr: null,
	start_x: null,
	start_y: null,
	min_y: null,
	max_y: null,
	min_x: null,
	max_x: null,
	ua: null,
	ie: null,

	//* Init
	_: function()
	{
		$('.guide_title').click(function()
		{
			$('.guide_inner').slideToggle();
		});

		$('.guide_more').click(function()
		{
			if ($(this).html() === '<i class="fa fa-caret-down"></i> see Details') {
				$(this).html('<i class="fa fa-caret-up"></i> hidden Details');
			} else {
				$(this).html('<i class="fa fa-caret-down"></i> see Details');
			}

			$('.guide_list_hid').slideToggle();
			$('.guide_detail_hid').slideToggle();
		});

		$('th').powerTip({
			mouseOnToPopup: true,
			fadeInTime: 0,
			fadeOUtTime: 0,
		});

		$('td.category').powerTip({
			mouseOnToPopup: false,
			fadeInTime: 0,
			fadeOUtTime: 0,
		});

		//* Validation Error Box hidden
		if ($('.msg_error').text() === '') {
			$('div.error').hide();
		}

		//* Active Image
		$('div.active_image_1').each(function()
		{
			var img = $(this).children('img')
			if (img.attr('src') === undefined) {
				var src = $(this).closest('tr').find('td.static_image').children('img').attr('src');
				var bin = $(this).closest('tr').find('td.static_image').children('input').val();
				img.attr('src', src);
			}
		});

		//* All Cell Column Width Height Fit
		var that = $('.all_column').closest('th');
		var w = that.innerWidth() - 2;
		var h = that.innerHeight() - 2;
		$('.all_column').css({width: w+'px', height: h+'px'});

		//* Column Width Height Fit
		$('.column_row th').each(function()
		{
			var w = $(this).innerWidth() - 2;
			var h = $(this).innerHeight() - 2;
			$(this).find('.column').css({width: w+'px', height: h+'px'});
		});

		$('.column, .all_column').css({padding: '10px 0px'});

		//* Cell Width Height Fit
		$('.cells td').each(function()
		{
			var w = $(this).innerWidth() - 2;
			var h = $(this).innerHeight() - 2;
			$(this).find('.cell').css({width: w+'px', height: h+'px'});
		});

		//* Init Var
		cell_data = {};

		Act.ua = window.navigator.userAgent.toLowerCase();
		Act.ie = (Act.ua.indexOf('msie') !== -1 || Act.ua.indexOf('trident') !== -1) ? true : false;
	},

	//* Image Modal
	a: function()
	{
		$('div.active_image').on('click', function(ev)
		{
			//* Right Click
			if (ev.which === 3) {
				return;
			}

			if ($(this).children('img').attr('src') !== undefined) {
				var index = $('div.active_image').index(this) + 1;
				if (confirm('画像 '+index+' を取り消しますか？')) {
					$(this).children('img').removeAttr('src');
					$(this).next('input.file').val('');
					return false;
				}
			}
			$(this).next('input.file').click();
		});
	},

	//* Image Put
	b: function()
	{
		$('input.file').on('change', function()
		{
			var file = $(this).prop('files')[0];
			var reader = new FileReader();
			that = $(this);
		
			reader.onload = function(ev)
			{
				that.prev('div.active_image').children('img').attr({src: ev.target.result, width: '50'});
			}
			reader.readAsDataURL(file);
		});
	},

	//* Category Modal
	c: function()
	{
		$(document).on('keyup', '.cell', function(ev){
			if (ev.keyCode === 18) {
				if (! $(this).find('.category_path').length) {
					return false;
				}
				var a = $(this).parent('.cell').siblings('a.cb');
				var item_id = $(this).closest('tr').attr('id');
				a.click().attr('href', '/mini_auction/category?item_id='+item_id).click();
			}
		});
	},

	//* Draft Save
	d: function()
	{
		$('a.save').on('click', function(ev)
		{
			//* Right Click
			if (ev.which === 3) {
				return;
			}

			var data = {};
			$('input').each(function()
			{
				var name = $(this).attr('name');
				var val = $(this).val();
				data[name] = val;
			 });
			$('textarea').each(function()
			{
				var name = $(this).attr('name');
				var val = $(this).val();
				data[name] = val;
			 });

			$.ajax(
			{
				type: 'post',
				url: 'https://'+location.host+'/mini_auction/pro/as_save',
				data: data,
				dataType: 'json'
			}).done(function(data, stat, xhr)
			{
				alert('下書き保存しました。');
			}).fail(function(xhr, stat, e)
			{});
		});
	},

	//* Cell Caret
	e: function()
	{
		$('.cell').on('dblclick', function(ev)
		{
			//* Right Click
			if (ev.which === 3) {
				return;
			}

			//* Current Cell Caret
			if ($(this).hasClass('cell_caret')) {
				return;
			}

			//* Others Cell Caret Close
			var v = $('.cell_caret .input').val();
			$('.cell_caret .input').remove();
			$('.cell_caret').text(v);
			$('.cell').removeClass('cell_caret');

			//* Select Cell Caret Open
			$(this).addClass('cell_caret');
			var v = $(this).siblings('.hid').val();
			var h = $(this).height();
			var w = $(this).width();
			$(this).text('');
			if ($(this).closest('td.description').length) {
				$(this).prepend('<textarea class="input"></textarea>');
			} else {
				$(this).prepend('<input class="input" type="text" value="">');
			}

			//* Caret to String End
			$('.input').height(h).width(w).focus().css({textAlign: 'center'}).val(v+'');
		});
	},

	//* Cell Input Value Into Hidden Value
	f: function()
	{
		$(document).on('keyup', '.input', function()
		{
			var v = $(this).val();
			$(this).parent().siblings('.hid').val(v);
		});
	},

	//* Cell Drag Selection
	g: function()
	{
		var prev_elem;

		//* Mouse Down
		$(document).on('mousedown', '.cell', function(ev)
		{
			//* Right Click
			if (ev.which === 3) {
				//** Exclusive Cells
				if ($(ev.target).closest('.cells').length) {
					$('.cells').addClass('righted');
					if (! $('.context-menu-item div').hasClass('context_menu_prefix')) {
						$('.context-menu-item').eq(0).prepend('<div class="context_menu_prefix"><i class="fa fa-copy"></i></div>');
						$('.context-menu-item').eq(1).prepend('<div class="context_menu_prefix"><i class="fa fa-cut"></i></div>');
						$('.context-menu-item').eq(2).prepend('<div class="context_menu_prefix"><i class="fa fa-paste"></i></div>');
						$('.context-menu-item').eq(3).prepend('<div class="context_menu_prefix"><i class="fa fa-trash-o"></i></div>');
					}
				}
				return;
			}

			//* Class & Cell Init
			$('.cell').removeClass('cell_selection cell_selection_bgcolor cell_moving').css({border: '1px solid transparent', boxShadow: 'none'});
			$('.column').removeClass('column_selection column_selection_bgcolor column_moving').css({border: '1px solid transparent', boxShadow: 'none'});
			$('.all_column').removeClass('column_selection column_selection_bgcolor column_moving').css({border: '1px solid transparent', boxShadow: 'none'});
			$('.row').removeClass('row_selection row_selection_bgcolor row_moving').css({boxShadow: 'none'});

			//* Start Element
			Act.start_elem = $(ev.target).closest('.cell');
			Act.start_cell = Act.start_elem;

			//* Start Element Class & Border
			Act.start_elem.addClass('cell_selection cell_moving').css({border: Act.border_style});

			//* Start Element tr
			Act.start_tr = Act.start_elem.closest('.cell_row');

			//* Start Element Index
			Act.start_y = $('.cell_row').index(Act.start_tr);
			Act.start_x = $('.cell_row').eq(Act.start_y).find('.cell').index(this);

			//* Range
			Act.min_y = Act.start_y;
			Act.max_y = Act.start_y;
			Act.min_x = Act.start_x;
			Act.max_x = Act.start_x;

		//* Mouse Drag
		}).on('mouseover', '.cell', function(ev)
		{
			//* Not Moving
			if (0 === $('.cells .cell_moving').length) {
				return;
			}

			//* Default Selection Clear
			//** Firefox, Chrome, Safari, Opera
			if (document.getSelection) {
				document.getSelection().removeAllRanges();
			//** IE
			} else {
				document.selection.empty();
			}

			//* Move Element
			var move_elem = $(ev.target).closest('.cell');

			//* Prev Element
			if (move_elem === prev_elem) {
				return;
			}

			//* Not Prev Element
			prev_elem = move_elem;

			//** Window Edge Moving
			var scroll_top = $(window).scrollTop();
			var scroll_left = $(window).scrollLeft();

			var window_height = $(window).height();
			var window_width = $(window).width();

			//*** Element Offset
			var elem_top = move_elem.offset().top;
			var elem_bottom = move_elem.offset().top + move_elem.innerHeight();
			var elem_left = move_elem.offset().left;
			var elem_right = move_elem.offset().left + move_elem.innerWidth();

			//*** Current Offset
			var current_top = elem_top - scroll_top;
			var current_bottom = elem_bottom - scroll_top;
			var current_left = elem_left - scroll_left;
			var current_right = elem_right - scroll_left;

			//*** Left
			if (20 > current_left) {
				var to_left = scroll_left + current_left - 20;
				$('html,body').animate(
				{
					scrollLeft: to_left
				}, 0);
			}
			//*** Top
			if (20 > current_top) {
				var to_top = scroll_top + current_top - 20;
				$('html,body').animate(
				{
					scrollTop: to_top
				}, 0);
			}
			//*** Right
			if ((window_width - 20) < current_right) {
				var to_right = scroll_left + (current_right - window_width) + 20;
				$('html,body').animate(
				{
					scrollLeft: to_right
				}, 0);
			}
			//*** Bottom
			if ((window_height - 20) < current_bottom) {
				var to_bottom = scroll_top + (current_bottom - window_height) + 20;
				$('html,body').animate(
				{
					scrollTop: to_bottom
				}, 0);
			}

			//* Move Element Tr
			var move_tr = move_elem.closest('.cell_row');

			//* Move Element Index
			var move_y = $('.cell_row').index(move_tr);
			var move_x = $('.cell_row').eq(move_y).find('.cell').index(this);

			//* Row Index Range
			if (Act.start_y < move_y) {
				Act.min_y = Act.start_y;
				Act.max_y = move_y;
			} else if (Act.start_y > move_y) {
				Act.min_y = move_y;
				Act.max_y = Act.start_y;
			} else {
				Act.min_y = Act.start_y;
				Act.max_y = Act.start_y;
			}

			//* Column Index Range
			if (Act.start_x < move_x) {
				Act.min_x = Act.start_x;
				Act.max_x = move_x;
			} else if (Act.start_x > move_x) {
				Act.min_x = move_x;
				Act.max_x = Act.start_x;
			} else {
				Act.min_x = Act.start_x;
				Act.max_x = Act.start_x;
			}

			//* Class & Selection Init
			$('.cell').removeClass('cell_selection cell_selection_bgcolor cell_moving').css({border: '1px solid transparent'});
			$('.column').removeClass('column_selection column_selection_bgcolor column_moving').css({border: '1px solid transparent'});
			$('.all_column').removeClass('column_selection column_selection_bgcolor column_moving').css({border: '1px solid transparent'});
			$('.row').removeClass('row_selection row_selection_bgcolor row_moving');

			//* Class Add
			Act.start_elem.addClass('cell_moving');

			//* Selection Bgcolor & Border
			for (var y = Act.min_y; y <= Act.max_y; y++) {
				for (var x = Act.min_x; x <= Act.max_x; x++) {

					//** Loop Element
					var elem = $('.cell_row').eq(y).find('.cell').eq(x);

					//** Selection Bgcolor
					elem.addClass('cell_selection cell_selection_bgcolor');

					//** Border
					//*** y
					if (y === Act.min_y) {
						elem.css({borderTop: Act.border_style});
					}
					if (y === Act.max_y) {
						elem.css({borderBottom: Act.border_style});
					}
					//*** x
					if (x === Act.min_x) {
						elem.css({borderLeft: Act.border_style});
					}
					if (x === Act.max_x) {
						elem.css({borderRight: Act.border_style});
					}
				}
			}

			//* Start Cell No Bgcolor
			Act.start_cell.removeClass('cell_selection_bgcolor');

		//* Mouse Up
		}).on('mouseup', '.cell', function(ev)
		{
			//* Right Click
			if (ev.which === 3) {
				return;
			}

			//* Moving Remove
			$('.all_column').removeClass('column_moving');
			$('.column').removeClass('column_moving');
			$('.row').removeClass('row_moving');
			$('.cell').removeClass('cell_moving');
		});
	},

	//* Selection Remove
	h: function()
	{
		$(document).on('click', function(ev)
		{
			//* Right Click
			if (ev.which === 3) {
				return;
			}

			//* Caretint
			if ($(ev.target).closest('.cell').hasClass('cell_caret')) {
				return;
			}

			//* Caret Remove
			var v = $('.cell_caret .input').val();
			$('.cell_caret').remove('.input');
			$('.cell_caret').text(v);
			$('.cell_caret').siblings('.hid').val(v);
			$('.cell').removeClass('cell_caret');

			//* Exclusive Cells
			if ($(ev.target).closest('.cells').length) {
				return;
			}

			//* Exclusive Cells
			if ($(ev.target).closest('.columns').length) {
				return;
			}

			//* Right Click
			if ($('.cells').hasClass('righted')) {
				$('.cells').removeClass('righted');
				return;
			}

			//* Selection Remove
			$('.cells .cell').removeClass('cell_selection cell_selection_bgcolor').css({border: '1px solid transparent'});
			$('.cells .row').removeClass('row_selection row_selection_bgcolor');
			$('.columns .column').removeClass('column_selection column_selection_bgcolor').css({border: '1px solid transparent'});
			$('.columns .all_column').removeClass('column_selection column_selection_bgcolor').css({border: '1px solid transparent'});
		});
	},

	//* Context Action
	i: function()
	{
		var cell_data = {};

		$.contextMenu(
		{
			selector: '.cell, .column, .all_column, .row',
			items:{
				'copy':
				{
					name: 'Copy',
					callback: function()
					{
						//* Copy
						cell_data = {};
						cell_data['text'] = {};
						cell_data['category_path'] = {};
						for (var y = Act.min_y; y <= Act.max_y; y++) {
							for (var x = Act.min_x; x <= Act.max_x; x++) {
								var elem = $('tr.cell_row').eq(y).find('.cell').eq(x).siblings('input.hid');
								var category_path = $('tr.cell_row').eq(y).find('.cell').eq(x).siblings('input.category_path');
								if (cell_data['text'][y] === undefined) {
									cell_data['text'][y] = {};
								}
								if (cell_data['category_path'][y] === undefined) {
									cell_data['category_path'][y] = {};
								}
								cell_data['text'][y][x] = elem.val();
								cell_data['category_path'][y][x] = category_path.val();
							}
						}
					}
				},
				'cut':
				{
					name: 'Cut',
					callback: function()
					{
						//* Cut
						cell_data = {};
						cell_data['text'] = {};
						cell_data['category_path'] = {};
						for (var y = Act.min_y; y <= Act.max_y; y++) {
							for (var x = Act.min_x; x <= Act.max_x; x++) {
								var elem = $('tr.cell_row').eq(y).find('.cell').eq(x);
								var hid = elem.siblings('input.hid');
								var category_path = elem.siblings('input.category_path');
								var category_id = elem.siblings('input.category_id');

								//* Copy
								if (cell_data['text'][y] === undefined) {
									cell_data['text'][y] = {};
								}
								//* Copy
								if (cell_data['category_path'][y] === undefined) {
									cell_data['category_path'][y] = {};
								}
								cell_data['text'][y][x] = hid.val();
								cell_data['category_path'][y][x] = category_path.val();

								//* Deletion
								elem.text('');
								hid.val('');
								category_path.val('');
								category_id.val('');
								category_id.attr('title', '');
								category_path.parent('td.category').data('powertip', '');
							}
						}
					}
				},
				'paste':
				{
					name: 'Paste',
					callback: function()
					{
						//* y
						//** Copy Count
						var copy_count_y = Object.keys(cell_data).length;
						//** Past Count
						var paste_count_y = Act.max_y - Act.min_y + 1;

						//** Base Count Paste Check
						var base_paste_flag = false;
						var multiple_y = 1;
						var miltiple_x = 1;
						//*** Paste Count Smaller
						if (copy_count_y > paste_count_y) {
							base_paste_flag = true;
						}

						//*** Multiple Check
						var remainder = paste_count_y % copy_count_y;
						//**** No Multiple
						if (remainder !== 0) {
							base_paste_flag = true;
						//**** Multiple
						} else {
							multiple_y = paste_count_y / copy_count_y;
						}

						//*** No Base Count Paste
						if (! base_paste_flag) {
							//**** x
							//***** Copy Count
							var copy_count_x;
							$.each(cell_data, function(y, a)
							{
								copy_count_x = Object.keys(a).length;
								return;
							});
							//***** Paste Count
							var paste_count_x = Act.max_x - Act.min_x + 1;

							//***** Paste Count Smaller
							if (copy_count_x > paste_count_x) {
								base_paste_flag = true;
							}

							//***** Multiple Check
							var remainder = paste_count_x % copy_count_x;
							//****** No Multiple
							if (remainder !== 0) {
								base_paste_flag = true;
							//****** Multiple
							} else {
								multiple_x = paste_count_x / copy_count_x;
							}
						}

						//* Base Paste Init
						if (base_paste_flag) {
							multiple_y = 1;
							multiple_x = 1;
						}

						//* Paste
						var yy = Act.min_y;
						//** Paste Range Loop
						for (var i = 0; i < multiple_y; i++) {
							//** Copy Range Loop
							$.each(cell_data['text'], function(y, a)
							{
								var xx = Act.min_x;
								//** Paste Range Loop
								for (var j = 0; j < multiple_x; j++) {
									//** Conpy Range Loop
									$.each(a, function(x, v)
									{
										var elem = $('tr.cell_row').eq(yy).find('.cell').eq(xx);
										var hid = elem.siblings('input.hid');
										var category_path = elem.siblings('input.category_path');
										var category_id = elem.siblings('input.category_id');
										elem.text(v);
										hid.val(v);
										category_path.val(cell_data['category_path'][y][x]);
										category_id.attr('title', cell_data['category_path'][y][x]);
										category_path.parent('td.category').data('powertip', cell_data['category_path'][y][x]);
										xx++;
									});
								}
								yy++;
							});
						}
					}
				},
				'delete':
				{
					name: 'Delete',
					callback: function()
					{
						//* Deletion
						for (var y = Act.min_y; y <= Act.max_y; y++) {
							var field = {};
							for (var x = Act.min_x; x <= Act.max_x; x++) {
								var elem = $('tr.cell_row').eq(y).find('.cell').eq(x);
								elem.text('');
								elem.siblings('input.hid').val('');
								elem.siblings('input.category_path').val('');
								elem.siblings('input.category_id').val('');
								elem.siblings('input.category_id').attr('title', '');
								elem.siblings('input.category_path').parent('td.category').data('powertip', '');
							}
						}
					}
				},
			}
		});
	},

	//* Key Action
	j: function()
	{
		$(document).on('keydown', function(ev)
		{
			if (! $('.cell').hasClass('cell_selection')) {
				return;
			}

			//* Default Selection Clear
			//** Firefox, Chrome, Safari, Opera
			if (document.getSelection) {
				// Chrome Bug uninputable
				//document.getSelection().removeAllRanges();
			//** IE
			} else {
				document.selection.empty();
			}

			//* Ctrl + c, v, x, del
			if (ev.ctrlKey) {
				//** Copy
				if (ev.keyCode === 67) {
					cell_data = {};
					cell_data['text'] = {};
					cell_data['category_path'] = {};
					for (var y = Act.min_y; y <= Act.max_y; y++) {
						for (var x = Act.min_x; x <= Act.max_x; x++) {
							var elem = $('tr.cell_row').eq(y).find('.cell').eq(x).siblings('input.hid');
							var category_path = $('tr.cell_row').eq(y).find('.cell').eq(x).siblings('input.category_path');
							if (cell_data['text'][y] === undefined) {
								cell_data['text'][y] = {};
							}
							if (cell_data['category_path'][y] === undefined) {
								cell_data['category_path'][y] = {};
							}
							cell_data['text'][y][x] = elem.val();
							cell_data['category_path'][y][x] = category_path.val();
						}
					}
				//** Cut
				} else if (ev.keyCode === 88) {
					cell_data = {};
					cell_data['text'] = {};
					cell_data['category_path'] = {};
					for (var y = Act.min_y; y <= Act.max_y; y++) {
						for (var x = Act.min_x; x <= Act.max_x; x++) {
							var elem = $('tr.cell_row').eq(y).find('.cell').eq(x);
							var hid = elem.siblings('input.hid');
							var category_path = elem.siblings('input.category_path');
							var category_id = elem.siblings('input.category_id');

							//*** Copy
							if (cell_data['text'][y] === undefined) {
								cell_data['text'][y] = {};
							}
							cell_data['text'][y][x] = hid.val();
							if (cell_data['category_path'][y] === undefined) {
								cell_data['category_path'][y] = {};
							}
							cell_data['category_path'][y][x] = category_path.val();

							//*** Deletion
							elem.text('');
							hid.val('');
							category_path.val('');
							category_id.val('');
							category_id.attr('title', '');
							category_path.parent('td.category').data('powertip', '');
						}
					}
				//** Paste
				} else if (ev.keyCode === 86) {
					//* y
					//** Copy Count
					var copy_count_y = Object.keys(cell_data).length;
					//** Past Count
					var paste_count_y = Act.max_y - Act.min_y + 1;

					//** Base Count Paste Check
					var base_paste_flag = false;
					var multiple_y = 1;
					var miltiple_x = 1;
					//*** Paste Count Smaller
					if (copy_count_y > paste_count_y) {
						base_paste_flag = true;
					}

					//*** Multiple Check
					var remainder = paste_count_y % copy_count_y;
					//**** No Multiple
					if (remainder !== 0) {
						base_paste_flag = true;
					//**** Multiple
					} else {
						multiple_y = paste_count_y / copy_count_y;
					}

					//*** No Base Count Paste
					if (! base_paste_flag) {
						//**** x
						//***** Copy Count
						var copy_count_x;
						$.each(cell_data, function(y, a)
						{
							copy_count_x = Object.keys(a).length;
							return;
						});
						//***** Paste Count
						var paste_count_x = Act.max_x - Act.min_x + 1;

						//***** Paste Count Smaller
						if (copy_count_x > paste_count_x) {
							base_paste_flag = true;
						}

						//***** Multiple Check
						var remainder = paste_count_x % copy_count_x;
						//****** No Multiple
						if (remainder !== 0) {
							base_paste_flag = true;
						//****** Multiple
						} else {
							multiple_x = paste_count_x / copy_count_x;
						}
					}

					//* Base Paste Init
					if (base_paste_flag) {
						multiple_y = 1;
						multiple_x = 1;
					}

					//* Paste
					var yy = Act.min_y;
					//** Paste Range Loop
					for (var i = 0; i < multiple_y; i++) {
						//** Copy Range Loop
						$.each(cell_data['text'], function(y, a)
						{
							var xx = Act.min_x;
							//** Paste Range Loop
							for (var j = 0; j < multiple_x; j++) {
								//** Conpy Range Loop
								$.each(a, function(x, v)
								{
									var elem = $('tr.cell_row').eq(yy).find('.cell').eq(xx);
									var hid = elem.siblings('input.hid');
									var category_path = elem.siblings('input.category_path');
									var category_id = elem.siblings('input.category_id');
									elem.text(v);
									hid.val(v);
									category_path.val(cell_data['category_path'][y][x]);
									category_id.attr('title', cell_data['category_path'][y][x]);
									category_path.parent('td.category').data('powertip', cell_data['category_path'][y][x]);
									xx++;
								});
							}
							yy++;
						});
					}
				//** Delete or Backspace
				} else if (ev.keyCode === 46 || ev.keyCode === 8) {
					for (var y = Act.min_y; y <= Act.max_y; y++) {
						var field = {};
						for (var x = Act.min_x; x <= Act.max_x; x++) {
							var elem = $('tr.cell_row').eq(y).find('.cell').eq(x);
							elem.text('');
							elem.siblings('input.hid').val('');
							elem.siblings('input.category_path').val('');
							elem.siblings('input.category_id').val('');
							elem.siblings('input.category_id').attr('title', '');
							elem.siblings('input.category_path').parent('td.category').data('powertip', '');
						}
					}
				}
				//** Return
				return;
			}

			//* Alt + Enter Key
			if (ev.altKey) {
				if (ev.keyCode === 13) {
					Act.start_cell = $('tr.cell_row').eq(Act.start_y).find('.cell').eq(Act.start_x);
					if (Act.start_cell.closest('td.description').length && Act.start_cell.hasClass('cell_caret')) {
						var textarea = Act.start_cell.find('textarea');
						var v = textarea.val();
						textarea.val(v+"\n");
						return false;
					}
				}
			}

			//* Shift + Cursor Key
			if (ev.shiftKey) {
				var flag;
				//** Left
				if (ev.keyCode === 37) {
					if (Act.min_x === 0 && Act.max_x === 0) {
						return false;
					}

					if (Act.start_x < Act.max_x) {
						Act.max_x--;
						flag = 'rigth';
					} else if (Act.start_x > Act.min_x) {
						if (Act.min_x === 0) {
							return false;
						}
						Act.min_x--;
						flag = 'left';
					} else {
						Act.min_x--;
						flag = 'left';
					}
				//** Up
				} else if (ev.keyCode === 38) {
					if (Act.min_y === 0 && Act.max_y === 0) {
						return false;
					}

					if (Act.start_y < Act.max_y) {
						Act.max_y--;
						flag = 'down';
					} else if (Act.start_y > Act.min_y) {
						if (Act.min_y === 0) {
							return false;
						}
						Act.min_y--;
						flag = 'top';
					} else {
						Act.min_y--;
						flag = 'top';
					}
				//** Right
				} else if (ev.keyCode === 39) {
					var max_td = $('tr.cell_row').eq(Act.start_y).find('.cell').length - 1;

					if (Act.min_x === max_td && Act.max_x === max_td) {
						return false;
					}

					if (Act.start_x < Act.max_x) {
						if (Act.max_x === max_td) {
							return false;
						}
						Act.max_x++;
						flag = 'right';
					} else if (Act.start_x > Act.min_x) {
						Act.min_x++;
						flag = 'left';
					} else {
						Act.max_x++;
						flag = 'left';
					}
				//** Down
				} else if (ev.keyCode === 40) {
					var max_tr = $('tr.cell_row').length - 1;

					if (Act.min_y === max_tr && Act.max_y === max_tr) {
						return false;
					}

					if (Act.start_y < Act.max_y) {
						if (Act.max_y === max_tr) {
							return false;
						}
						Act.max_y++;
						flag = 'down';
					} else if (Act.start_y > Act.min_y) {
						Act.min_y++;
						flag = 'up';
					} else {
						Act.max_y++;
						flag = 'up';
					}
				} else {
					return;
				}

				//* Caret Finish
				if ($('.cell').hasClass('cell_caret')) {
					var v = $('.cell_caret .input').val();
					$('.cell_caret .input').remove();
					$('.cell_caret').text(v);
					$('.cell').removeClass('cell_caret');
				}

				//** Selection Init
				$('.cell').removeClass('cell_selection cell_selection_bgcolor cell_moving').css({border: '1px solid transparent'});

				//** Selection Bgcolor & Border
				for (var y = Act.min_y; y <= Act.max_y; y++) {
					for (var x = Act.min_x; x <= Act.max_x; x++) {

						//*** Loop Element
						var elem = $('tr.cell_row').eq(y).find('.cell').eq(x);

						//*** Selection Bgcolor
						elem.addClass('cell_selection cell_selection_bgcolor');

						//*** Border
						//***** y
						if (y === Act.min_y) {
							elem.css({borderTop: Act.border_style});
						}
						if (y === Act.max_y) {
							elem.css({borderBottom: Act.border_style});
						}
						//**** x
						if (x === Act.min_x) {
							elem.css({borderLeft: Act.border_style});
						}
						if (x === Act.max_x) {
							elem.css({borderRight: Act.border_style});
						}
					}
				}
				//** Start Selection Bgcolor Clear
				Act.start_elem.removeClass('cell_selection_bgcolor');

				//** Window Center
				var to_elem;
				if (flag === 'top') {
					if (Act.start_x < Act.max_x) {
						to_elem = $('tr.cell_row').eq(Act.min_y).find('.cell').eq(Act.max_x);
					} else if (Act.start_x > Act.min_x) {
						to_elem = $('tr.cell_row').eq(Act.min_y).find('.cell').eq(Act.min_x);
					} else {
						to_elem = $('tr.cell_row').eq(Act.min_y).find('.cell').eq(Act.min_x);
					}
				} else if (flag === 'down') {
					if (Act.start_x < Act.max_x) {
						to_elem = $('tr.cell_row').eq(Act.max_y).find('.cell').eq(Act.min_x);
					} else if (Act.start_x > Act.min_x) {
						to_elem = $('tr.cell_row').eq(Act.max_y).find('.cell').eq(Act.max_x);
					} else {
						to_elem = $('tr.cell_row').eq(Act.max_y).find('.cell').eq(Act.min_x);
					}
				} else if (flag === 'left') {
					if (Act.start_y < Act.max_y) {
						to_elem = $('tr.cell_row').eq(Act.max_y).find('.cell').eq(Act.min_x);
					} else if (Act.start_x > Act.min_x) {
						to_elem = $('tr.cell_row').eq(Act.min_y).find('.cell').eq(Act.min_x);
					} else {
						to_elem = $('tr.cell_row').eq(Act.max_y).find('.cell').eq(Act.min_x);
					}
				} else if (flag === 'right') {
					if (Act.start_y < Act.max_y) {
						to_elem = $('tr.cell_row').eq(Act.min_y).find('.cell').eq(Act.max_x);
					} else if (Act.start_x > Act.min_x) {
						to_elem = $('tr.cell_row').eq(Act.max_y).find('.cell').eq(Act.max_x);
					} else {
						to_elem = $('tr.cell_row').eq(Act.min_y).find('.cell').eq(Act.max_x);
					}
				} else {
					return;
				}

				//** Window Edge Moving
				var scroll_top = $(window).scrollTop();
				var scroll_left = $(window).scrollLeft();

				var window_height = $(window).height();
				var window_width = $(window).width();

				//*** Element Offset
				var elem_top = to_elem.offset().top;
				var elem_bottom = to_elem.offset().top + to_elem.innerHeight();
				var elem_left = to_elem.offset().left;
				var elem_right = to_elem.offset().left + to_elem.innerWidth();

				//*** Current Offset
				var current_top = elem_top - scroll_top;
				var current_bottom = elem_bottom - scroll_top;
				var current_left = elem_left - scroll_left;
				var current_right = elem_right - scroll_left;

				//*** To Offset
				var to_top = scroll_top + current_top;
				var to_bottom = scroll_top + (current_bottom - window_height);
				var to_left = scroll_left + current_left;
				var to_right = scroll_left + (current_right - window_width);

				//*** Left
				if (ev.keyCode === 37 &&  0 > current_left) {
					$('html,body').animate(
					{
						scrollLeft: to_left
					}, 0);
				}
				//*** Top
				if (ev.keyCode === 38 &&  0 > current_top) {
					$('html,body').animate(
					{
						scrollTop: to_top
					}, 0);
				}
				//*** Right
				if (ev.keyCode === 39 && window_width < current_right) {
					$('html,body').animate(
					{
						scrollLeft: to_right
					}, 0);
				}
				//*** Bottom
				if (ev.keyCode === 40 && window_height < current_bottom) {
					$('html,body').animate(
					{
						scrollTop: to_bottom
					}, 0);
				}

				//** Return
				//*** After Event Off
				return false;
			}

			//* Shift Key
			if (ev.keyCode === 16) {
				return;
			}

			//* Cursor Key & Enter Key
			if (ev.keyCode === 37 || ev.keyCode === 38 || ev.keyCode === 39 || ev.keyCode === 40 || ev.keyCode === 13) {
				//** Caret Finish
				if ($('.cell').hasClass('cell_caret')) {
					var v = $('.cell_caret .input').val();
					//*** Not Empty & Not Enter(Cursor Key) = inner caret moving
					if (v !== '' && ev.keyCode !== 13) {
						return;
					}

					//*** Category Path Search & Tooltip Set
					Act._n($('.cell_caret'));
					
					//*** Empty
					$('.cell_caret .input').remove();
					$('.cell_caret').text(v);
					$('.cell').removeClass('cell_caret');
				}

				//** Left
				if (ev.keyCode === 37) {
					if (Act.start_x === 0) {
						return false;
					}
					var from_elem = $('tr.cell_row').eq(Act.start_y).find('.cell').eq(Act.start_x);
					Act.start_x--;
					var to_elem = $('tr.cell_row').eq(Act.start_y).find('.cell').eq(Act.start_x);
				//** Up
				} else if (ev.keyCode === 38) {
					if (Act.start_y === 0) {
						return false;
					}
					var from_elem = $('tr.cell_row').eq(Act.start_y).find('.cell').eq(Act.start_x);
					Act.start_y--;
					var to_elem = $('tr.cell_row').eq(Act.start_y).find('.cell').eq(Act.start_x);
				//** Right
				} else if (ev.keyCode === 39) {
					var max_td = $('tr.cell_row').eq(Act.start_y).find('.cell').length;
					if (Act.start_x === (max_td - 1)) {
						return false;
					}
					var from_elem = $('tr.cell_row').eq(Act.start_y).find('.cell').eq(Act.start_x);
					Act.start_x++;
					var to_elem = $('tr.cell_row').eq(Act.start_y).find('.cell').eq(Act.start_x);
				//** Down
				} else if (ev.keyCode === 40 || ev.keyCode === 13) {
					var max_tr = $('tr.cell_row').length;
					if (Act.start_y === (max_tr - 1)) {
						return false;
					}

					var from_elem = $('tr.cell_row').eq(Act.start_y).find('.cell').eq(Act.start_x);
					Act.start_y++;
					var to_elem = $('tr.cell_row').eq(Act.start_y).find('.cell').eq(Act.start_x);
				}

				//** Selection Init
				$('.cell').removeClass('cell_selection cell_selection_bgcolor').css({border: '1px solid transparent'});

				//** Selection Move
				from_elem.removeClass('cell_selection').css({border: '1px solid transparent'});
				to_elem.addClass('cell_selection').css({border: Act.border_style});

				//** Range
				Act.min_y = Act.start_y;
				Act.max_y = Act.start_y;
				Act.min_x = Act.start_x;
				Act.max_x = Act.start_x;

				//** Down Element Move
				Act.start_elem.removeClass('cell_selection_start');
				Act.start_elem = $('tr.cell_row').eq(Act.start_y).find('.cell').eq(Act.start_x);
				Act.start_elem.removeClass('cell_selection_bgcolor').addClass('cell_selection_start');

				//** Window Edge Moving
				var scroll_top = $(window).scrollTop();
				var scroll_left = $(window).scrollLeft();

				var window_height = $(window).height();
				var window_width = $(window).width();
				//*** Element Offset
				var elem_top = to_elem.offset().top;
				var elem_bottom = elem_top + to_elem.innerHeight();
				var elem_left = to_elem.offset().left;
				var elem_right = elem_left + to_elem.innerWidth();

				//*** Current Offset
				var current_top = elem_top - scroll_top;
				var current_bottom = elem_bottom - scroll_top;
				var current_left = elem_left - scroll_left;
				var current_right = elem_right - scroll_left;

				//*** To Offset
				var to_top = scroll_top + current_top;
				var to_bottom = scroll_top + (current_bottom - window_height);
				var to_left = scroll_left + current_left;
				var to_right = scroll_left + (current_right - window_width);

				//*** Left
				if (ev.keyCode === 37 &&  0 > current_left) {
					$('html,body').animate(
					{
						scrollLeft: to_left
					}, 0);
				}
				//*** Top
				if (ev.keyCode === 38 &&  0 > current_top) {
					$('html,body').animate(
					{
						scrollTop: to_top
					}, 0);
				}
				//*** Right
				if (ev.keyCode === 39 && window_width < current_right) {
					$('html,body').animate(
					{
						scrollLeft: to_right
					}, 0);
				}
				//*** Bottom
				if ((ev.keyCode === 40 || ev.keyCode === 13) && window_height < current_bottom) {
					$('html,body').animate(
					{
						scrollTop: to_bottom
					}, 0);
				}

				//** Return
				//*** After Event Off
				return false;
			}

			//* Delete or Backspace
			if (ev.keyCode === 46 || ev.keyCode === 8) {
				if (! $('.cell').hasClass('cell_selection')) {
					return false;
				}

				//** Caret Exsistance
				if ($('.cell').hasClass('cell_caret')) {
					return;
				}

				//** Text Deletion
				for (var y = Act.min_y; y <= Act.max_y; y++) {
					var field = {};
					for (var x = Act.min_x; x <= Act.max_x; x++) {
						var elem = $('tr.cell_row').eq(y).find('.cell').eq(x);
						elem.text('');
						elem.siblings('input.hid').val('');
						elem.siblings('input.category_path').val('');
						elem.siblings('input.category_id').val('');
						elem.siblings('input.category_id').attr('title', '');
						elem.siblings('input.category_path').parent('td.category').data('powertip', '');
					}
				}

				//** Return
				return;
			}

			//* Alt Key
			if (ev.keyCode === 18) {
				Act.start_cell = $('tr.cell_row').eq(Act.start_y).find('.cell').eq(Act.start_x);
				if (! Act.start_cell.siblings('.category_path').length) {
					return;
				}
				var a = Act.start_cell.siblings('a.cb');
				var item_id = Act.start_cell.closest('tr').attr('id');
				a.click().attr('href', '/mini_auction/category?item_id='+item_id).click();

				return;
			}

			//* Other
			//** Caret Exsistance
			if ($('.cell_selection').hasClass('cell_caret')) {
				return;
			}

			//** Start Cell
			//*** Caret
			Act.start_cell = $('tr.cell_row').eq(Act.start_y).find('.cell').eq(Act.start_x);

			Act.start_cell.addClass('cell_caret');
			var v = Act.start_cell.siblings('.hid').val();
			var h = Act.start_cell.height();
			var w = Act.start_cell.width();
			Act.start_cell.text('');
			if (Act.start_cell.hasClass('description')) {
				Act.start_cell.prepend('<textarea class="input"></textarea>');
			} else {
				Act.start_cell.prepend('<input class="input" type="text" value="">');
			}
			//*** Caret to String End
			$('.input').height(h).width(w).focus().css({textAlign: 'center'}).val(v+'');
		});
	},

	//* Column Drag Selection
	k: function()
	{
		var prev_elem;

		//* Mouse Down
		$(document).on('mousedown', '.column', function(ev)
		{
			//* Right Click
			if (ev.which === 3) {
				//* Exclusive Columns
				if ($(ev.target).closest('.columns').length) {
					$('.columns').addClass('righted');
					if (! $('.context-menu-item div').hasClass('context_menu_prefix')) {
						$('.context-menu-item').eq(0).prepend('<div class="context_menu_prefix"><i class="fa fa-copy"></i></div>');
						$('.context-menu-item').eq(1).prepend('<div class="context_menu_prefix"><i class="fa fa-cut"></i></div>');
						$('.context-menu-item').eq(2).prepend('<div class="context_menu_prefix"><i class="fa fa-paste"></i></div>');
						$('.context-menu-item').eq(3).prepend('<div class="context_menu_prefix"><i class="fa fa-trash-o"></i></div>');
					}
				}
				return false;
			}

			//* Class & Border Init
			$('.columns .column').removeClass('column_selection column_selection_bgcolor column_moving').css({border: '1px solid transparent', boxShadow: 'none'});
			$('.cells .cell').removeClass('cell_selection cell_selection_bgcolor cell_moving').css({border: '1px solid transparent', boxShadow: 'none'});

			//* Start Column Element
			Act.start_elem = $(ev.target).closest('.column');
			Act.start_elem.addClass('colum_selection column_selection_bgcolor column_moving');

			//* Start Index
			Act.start_y = 0;
			Act.start_x = $('.column_row').eq(Act.start_y).find('.column').index(this);

			//* Start Cell Element
			Act.start_cell = $('.cell_row').eq(Act.start_y).find('.cell').eq(Act.start_x);

			//* Range
			Act.min_y = Act.start_y;
			Act.max_y = $('.cell_row').length - 1;
			Act.min_x = Act.start_x;
			Act.max_x = Act.start_x;

			//* Selection Bgcolor & Border
			for (var y = Act.min_y; y <= Act.max_y; y++) {
				//*** Loop Element
				var elem = $('.cell_row').eq(y).find('.cell').eq(Act.start_x);

				//*** Selection Bgcolor
				elem.addClass('cell_selection cell_selection_bgcolor');

				//*** Border
				//**** y
				if (y === Act.min_y) {
					elem.css({borderTop: Act.border_style});
				}
				if (y === Act.max_y) {
					elem.css({borderBottom: Act.border_style});
				}
				//**** x
				elem.css({borderLeft: Act.border_style});
				elem.css({borderRight: Act.border_style});
			}
			Act.start_cell.removeClass('cell_selection_bgcolor');

		//* Mouse Drag
		}).on('mouseover', '.column', function(ev)
		{
			//* Not Drag
			if (! $('.columns .column_moving').length) {
				return;
			}

			//* Default Selection Clear
			//** Firefox, Chrome, Safari, Opera
			if (document.getSelection) {
				document.getSelection().removeAllRanges();
			//** IE
			} else {
				document.selection.empty();
			}

			//* Move Element
			var move_elem = $(ev.target).closest('.column');

			//* Prev Element
			if (move_elem === prev_elem) {
				return;
			}

			//* Not Prev Element
			prev_elem = move_elem;

			//* Drag Element Index
			var move_y = Act.max_y;
			var move_x = $('.column_row').find('.column').index(this);

			//* Column Index Range
			if (Act.start_x < move_x) {
				Act.min_x = Act.start_x;
				Act.max_x = move_x;
			} else if (Act.start_x > move_x) {
				Act.min_x = move_x;
				Act.max_x = Act.start_x;
			} else {
				Act.min_x = Act.start_x;
				Act.max_x = Act.start_x;
			}

			//* Selection Init
			$('.column').removeClass('column_selection column_selection_bgcolor').css({border: '1px solid transparent'});
			$('.cell').removeClass('cell_selection cell_selection_bgcolor').css({border: '1px solid transparent'});

			//* Column Selected Check
			//move_elem.addClass('column_selection column_selection_bgcolor column_moving');

			//* Selection Bgcolor & Border
			for (var y = Act.min_y; y <= Act.max_y; y++) {
				for (var x = Act.min_x; x <= Act.max_x; x++) {

					var column_elem = $('.column_row').find('.column').eq(x);
					column_elem.addClass('column_selection column_selection_bgcolor column_moving');

					//*** Loop Element
					var elem = $('.cell_row').eq(y).find('.cell').eq(x);

					//*** Selection Bgcolor
					elem.addClass('cell_selection cell_selection_bgcolor');

					//*** Border
					//**** y
					if (y === Act.min_y) {
						elem.css({borderTop: Act.border_style});
					}
					if (y === Act.max_y) {
						elem.css({borderBottom: Act.border_style});
					}
					//**** x
					if (x === Act.min_x) {
						elem.css({borderLeft: Act.border_style});
					}
					if (x === Act.max_x) {
						elem.css({borderRight: Act.border_style});
					}
				}
			}
			Act.start_cell.removeClass('cell_selection_bgcolor');

		//* Mouse Up
		}).on('mouseup', '.column', function(ev)
		{
			//* Right Click
			if (ev.which === 3) {
				return;
			}

			//* Moving Remove
			$('.all_column').removeClass('column_moving');
			$('.column').removeClass('column_moving');
			$('.row').removeClass('row_moving');
			$('.cell').removeClass('cell_moving');
		});
	},

	//* All Column Selection
	l: function()
	{
		var prev_elem;

		//* Mouse Down
		$(document).on('click', '.all_column', function(ev)
		{
			//* Right Click
			if (ev.which === 3) {
				//* Exclusive Columns
				var elem;
				if (elem = $(ev.target).closest('.all_column').length) {
					elem.addClass('righted');
					if (! $('.context-menu-item div').hasClass('context_menu_prefix')) {
						$('.context-menu-item').eq(0).prepend('<div class="context_menu_prefix"><i class="fa fa-copy"></i></div>');
						$('.context-menu-item').eq(1).prepend('<div class="context_menu_prefix"><i class="fa fa-cut"></i></div>');
						$('.context-menu-item').eq(2).prepend('<div class="context_menu_prefix"><i class="fa fa-paste"></i></div>');
						$('.context-menu-item').eq(3).prepend('<div class="context_menu_prefix"><i class="fa fa-trash-o"></i></div>');
					}
				}
				return;
			}

			//* Class & Border Init
			$('.column').removeClass('column_selection column_selection_bgcolor column_moving').css({border: '1px solid transparent', boxShadow: 'none'});
			$('.all_column').removeClass('column_selection column_selection_bgcolor column_moving').css({border: '1px solid transparent', boxShadow: 'none'});
			$('.row').removeClass('row_selection row_selection_bgcolor row_moving').css({boxShadow: 'none'});
			$('.cell').removeClass('cell_selection cell_selection_bgcolor cell_moving').css({border: '1px solid transparent', boxShadow: 'none'});

			//* Start Column Element
			Act.start_elem = $(ev.target).closest('.all_column');
			Act.start_elem.addClass('colum_selection column_selection_bgcolor');

			//* Start Index
			Act.start_y = 0;
			Act.start_x = 0;

			//* Start Cell Element
			Act.start_cell = $('.cell_row').eq(Act.start_y).find('.cell').eq(Act.start_x);

			//* Range
			Act.min_y = Act.start_y;
			Act.max_y = $('.cell_row').length - 1;
			Act.min_x = Act.start_x;
			Act.max_x = $('.column').length

			$('.cells .cell_row .row').addClass('row_selection row_selection_bgcolor');
			$('.column').addClass('column_selection column_selection_bgcolor');

			//* Selection Bgcolor & Border
			for (var y = Act.min_y; y <= Act.max_y; y++) {
				for (var x = Act.min_x; x <= Act.max_x; x++) {
					//*** Loop Cell Element
					var elem = $('.cell_row').eq(y).find('.cell').eq(x);

					//*** Selection Bgcolor
					elem.addClass('cell_selection cell_selection_bgcolor');

					//*** Border
					//**** y
					if (y === Act.min_y) {
						elem.css({borderTop: Act.border_style});
					}
					if (y === Act.max_y) {
						elem.css({borderBottom: Act.border_style});
					}
					//**** x
					if (x === Act.min_x) {
						elem.css({borderLeft: Act.border_style});
					}
					if (x === Act.max_x) {
						elem.css({borderRight: Act.border_style});
					}
				}
			}
			Act.start_cell.removeClass('cell_selection_bgcolor');
		});
	},

	//* Row Drag Selection
	m: function()
	{
		var prev_elem;

		//* Mouse Down
		$(document).on('mousedown', '.row', function(ev)
		{
			//* Right Click
			if (ev.which === 3) {
				//* Exclusive Columns
				if ($(ev.target).closest('.row').length) {
					$('.row').addClass('righted');
					if (! $('.context-menu-item div').hasClass('context_menu_prefix')) {
						$('.context-menu-item').eq(0).prepend('<div class="context_menu_prefix"><i class="fa fa-copy"></i></div>');
						$('.context-menu-item').eq(1).prepend('<div class="context_menu_prefix"><i class="fa fa-cut"></i></div>');
						$('.context-menu-item').eq(2).prepend('<div class="context_menu_prefix"><i class="fa fa-paste"></i></div>');
						$('.context-menu-item').eq(3).prepend('<div class="context_menu_prefix"><i class="fa fa-trash-o"></i></div>');
					}
				}
				return;
			}

			//* Class & Border Init
			$('.columns .all_column').removeClass('column_selection column_selection_bgcolor column_moving').css({border: '1px solid transparent', boxShadow: 'none'});
			$('.columns .column').removeClass('column_selection column_selection_bgcolor column_moving').css({border: '1px solid transparent', boxShadow: 'none'});
			$('.cells .row').removeClass('row_selection row_selection_bgcolor row_moving').css({boxShadow: 'none'});
			$('.cells .cell').removeClass('cell_selection cell_selection_bgcolor cell_moving').css({border: '1px solid transparent', boxShadow: 'none'});

			//* Start Column Element
			Act.start_elem = $(ev.target).closest('.row');
			Act.start_elem.addClass('row_selection row_selection_bgcolor row_moving');

			//* Start Index
			Act.start_x = 0;
			Act.start_y = $('.row').index(this);

			//* Start Cell Element
			Act.start_cell = $('.cell_row').eq(Act.start_y).find('.cell').eq(Act.start_x);

			//* Range
			Act.min_y = Act.start_y;
			Act.max_y = Act.start_y;
			Act.min_x = Act.start_x;
			Act.max_x = $('.columns .column').length;

			//* Selection Bgcolor & Border
			for (var x = Act.min_x; x <= Act.max_x; x++) {
				//*** Loop Element
				var elem = $('.cell_row').eq(Act.start_y).find('.cell').eq(x);

				//*** Selection Bgcolor
				elem.addClass('cell_selection cell_selection_bgcolor');

				//*** Border
				//**** y
				elem.css({borderTop: Act.border_style});
				elem.css({borderBottom: Act.border_style});
				//**** x
				if (x === Act.min_x) {
					elem.css({borderLeft: Act.border_style});
				}
				if (x === Act.max_x) {
					elem.css({borderRight: Act.border_style});
				}
			}
			Act.start_cell.removeClass('cell_selection_bgcolor');

		//* Mouse Drag
		}).on('mouseover', '.row', function(ev)
		{
			//* Not Drag
			if (! $('.row_moving').length) {
				return;
			}

			//* Default Selection Clear
			//** Firefox, Chrome, Safari, Opera
			if (document.getSelection) {
				document.getSelection().removeAllRanges();
			//** IE
			} else {
				document.selection.empty();
			}

			//* Move Element
			var move_elem = $(ev.target).closest('.row');

			//* Prev Element
			if (move_elem === prev_elem) {
				return;
			}

			//* Not Prev Element
			prev_elem = move_elem;

			//* Drag Element Index
			var move_y = $('.row').index(this);
			var move_x = Act.min_x;

			//* Row Index Range
			if (Act.start_y < move_y) {
				Act.min_y = Act.start_y;
				Act.max_y = move_y;
			} else if (Act.start_y > move_y) {
				Act.min_y = move_y;
				Act.max_y = Act.start_y;
			} else {
				Act.min_y = Act.start_y;
				Act.max_y = Act.start_y;
			}

			//* Selection Init
			$('.all_column').removeClass('column_selection column_selection_bgcolor').css({border: '1px solid transparent'});
			$('.column').removeClass('column_selection column_selection_bgcolor').css({border: '1px solid transparent'});
			$('.row').removeClass('row_selection row_selection_bgcolor');
			$('.cell').removeClass('cell_selection cell_selection_bgcolor').css({border: '1px solid transparent'});

			//* Selection Bgcolor & Border
			for (var y = Act.min_y; y <= Act.max_y; y++) {
				//** Row Element
				var row_elem = $('.row').eq(y);

				//*** Selection Bgcolor
				row_elem.addClass('row_selection row_selection_bgcolor row_moving');

				for (var x = Act.min_x; x <= Act.max_x; x++) {
					//*** Loop Cell Element
					var elem = $('.cell_row').eq(y).find('.cell').eq(x);

					//*** Selection Bgcolor
					elem.addClass('cell_selection cell_selection_bgcolor');

					//*** Border
					//**** y
					if (y === Act.min_y) {
						elem.css({borderTop: Act.border_style});
					}
					if (y === Act.max_y) {
						elem.css({borderBottom: Act.border_style});
					}
					//**** x
					if (x === Act.min_x) {
						elem.css({borderLeft: Act.border_style});
					}
					if (x === Act.max_x) {
						elem.css({borderRight: Act.border_style});
					}
				}
			}
			Act.start_cell.removeClass('cell_selection_bgcolor');

		//* Mouse Up
		}).on('mouseup', '.row', function(ev)
		{
			//* Right Click
			if (ev.which === 3) {
				return;
			}

			//* Moving Remove
			$('.all_column').removeClass('column_moving');
			$('.column').removeClass('column_moving');
			$('.row').removeClass('row_moving');
			$('.cell').removeClass('cell_moving');
		});
	},

	_n: function(_that)
	{
			var category_id = _that.siblings('input.category_id').val();
			var data = {};
			data['category_id'] = category_id;
			data['adf'] = '0';
			data['category_path_get'] = '1';
			$.ajax(
			{
				type: 'get',
				url: 'https://'+location.host+'/mini_auction/as_category',
				data: data,
				dataType: 'json'
			}).done(function(data, stat, xhr)
			{
				_that.siblings('input.category_path').val(data);
				_that.siblings('input.category_id').attr('title', data);
				_that.siblings('input.category_id').parent('td.category').data('powertip', data);
			}).fail(function(xhr, stat, e)
			{});
	},

};


$(function(){
	Act._();
	Act.a();
	Act.b();
	Act.c();
	Act.d();
	Act.e();
	Act.f();
	Act.g();
	Act.h();
	Act.i();
	Act.j();
	Act.k();
	Act.l();
	Act.m();
});
