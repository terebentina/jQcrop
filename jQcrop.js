/* ==========================================================
 * jQcrop
 * https://github.com/terebentina/jQcrop
 * ==========================================================
 * Copyright 2013 Dan Caragea.
 *
 * Licensed under the MIT License (MIT)
 * ========================================================== */

/*jshint laxcomma:true, sub:true, browser:true, jquery:true, smarttabs:true, eqeqeq: false */

;(function($, undefined) {
	"use strict";

	var pluginName = 'jQcrop';

	function Crop($image, options) {
		var self = this;
		this.width = null;
		this.height = null;
		this.minPercent = null;

		this.options = $.extend({}, $.fn[pluginName].defaults, options);
		this.$image = $image;

		this.$image.hide().addClass('cropImage').wrap('<div class="cropFrame" />'); // wrap image in frame;
		this.$frame = this.$image.parent();
		if (typeof $.fn.hammer == 'function') {
			var dragData = {};
			this.$image.hammer().on('mousedown', function(e) {
				e.preventDefault(); // this prevents firefox's default image dragging
				e.stopPropagation();
			}).on("dragleft dragright dragup dragdown", function(e) {
				if (!dragData.imgWidth) {
					dragData.imgWidth = self.$image.width();
				}
				if (!dragData.imgHeight) {
					dragData.imgHeight = self.$image.height();
				}
				if (!dragData.imgX) {
					dragData.imgX = parseInt(self.$image.css('left'), 10);
				}
				if (!dragData.imgY) {
					dragData.imgY = parseInt(self.$image.css('top'), 10);
				}
				// disable browser scrolling
				e.gesture.preventDefault();
				e.gesture.stopPropagation();

				dragData.dx = e.gesture.deltaX;
				dragData.dy = e.gesture.deltaY;
				self.drag.call(self, dragData);
			}).on('release', function(e) {
				// disable browser scrolling
				e.gesture.preventDefault();
				dragData = {};
				self.update();
			}).on('doubletap', function(e) {
				// disable browser scrolling
				e.gesture.preventDefault();
				self.zoomIn.call(self);
			}).on('pinchin pinchout', function(e) {
				// disable browser scrolling
				e.gesture.preventDefault();
				if (e.type == 'pinchin') {
					self.zoom.call(self, self.percent - e.gesture.scale / 110);
				} else {
					self.zoom.call(self, self.percent + (e.gesture.scale - 1) / 110);
				}
			});
		}
		this.$image.on('load.' + pluginName, function() {
			$('<img/>').on('load', function() {
				self.width = this.width;
				self.height = this.height;
				var  widthRatio = self.options.width / self.width
					,heightRatio = self.options.height / self.height
					;
				if (widthRatio >= heightRatio) {
					self.minPercent = self.width < self.options.width ? self.options.width / self.width : widthRatio;
				} else {
					self.minPercent = self.height < self.options.height ? self.options.height / self.height : heightRatio;
				}
				self.focal = {
					 x: Math.round(self.width / 2)
					,y: Math.round(self.height / 2)
				};
				self.zoom(self.minPercent);
				self.$frame.removeClass('loading');
				self.$image.fadeIn('fast'); //display image now that it has loaded
				self.update();
			}).prop('draggable', false).attr('src', self.$image.attr('src'));
		}).trigger('load.' + pluginName);

		this.$frame.on('resize.' + pluginName, function() {
				self.$frame.width(self.options.width).height(self.options.height);
				self.$image.trigger('load.' + pluginName);
			}).hover(function() {
				self.$frame.toggleClass('hover');
			}).addClass('loading').trigger('resize.' + pluginName);

		var controls = null;
		if (this.options.controls !== null) {
			controls = this.options.controls;
		} else {
			controls = $('<div/>', { 'class' : 'cropControls' })
					.append($('<span>Click to drag</span>'))
					.append($('<a/>', { 'class' : 'cropZoomIn' }).on('click.' + pluginName, $.proxy(this.zoomIn, this)))
					.append($('<a/>', { 'class' : 'cropZoomOut' }).on('click.' + pluginName, $.proxy(this.zoomOut, this)));
		}
		if (controls !== false) {
			this.$frame.append(controls);
		}
	}

	$.extend(Crop.prototype, {
		set: function(key, value) {
			var resize = false
				,self = this
				;
			if ($.type(key) == 'string') {
				if ($.type(this.options[key]) !== 'undefined') {
					this.options[key] = value;
					if (['width', 'height'].indexOf(key) !== -1) {
						resize = true;
					}
				}
			} else if ($.type(key) == 'object') {
				$.each(key, function(k, v) {
					self.set(k, v);
				});
			}

			if (resize) {
				this.$frame.trigger('resize.' + pluginName);
			}
		}
		,zoom: function(percent) {
			this.percent = Math.max(this.minPercent, Math.min(1, percent));
			this.$image.width(Math.ceil(this.width * this.percent));
			this.$image.css({
				 left: this.fill(- Math.round(this.focal.x * this.percent - this.options.width / 2), this.$image.width(), this.options.width)
				,top: this.fill(- Math.round(this.focal.y * this.percent - this.options.height / 2), this.$image.height(), this.options.height)
			});
		}
		,zoomIn: function(e) {
			this.zoom(this.percent + (1 - this.minPercent) / (this.options.zoom - 1 || 1));
			if (e) {    // because it's called from a click event, not hammer
				this.update();
			}
		}
		,zoomOut: function(e) {
			this.zoom(this.percent - (1 - this.minPercent) / (this.options.zoom - 1 || 1));
			if (e) {    // because it's called from a click event, not hammer
				this.update();
			}
		}
		,drag: function(data) {
			this.$image.css({
				left: this.fill(data.imgX + data.dx, data.imgWidth, this.options.width)
				,top: this.fill(data.imgY + data.dy, data.imgHeight, this.options.height)
			});
		}
		,update: function() {
			this.focal = {
				 x: Math.round((this.options.width / 2 - parseInt(this.$image.css('left'), 10)) / this.percent)
				,y: Math.round((this.options.height / 2 - parseInt(this.$image.css ('top'), 10)) / this.percent)
			};
			this.result = {
				 cropX: - Math.floor(parseInt(this.$image.css('left'), 10) / this.percent)
				,cropY: - Math.floor(parseInt(this.$image.css('top'), 10) / this.percent)
				,cropW: Math.round(this.options.width / this.percent)
				,cropH: Math.round(this.options.height / this.percent)
				,stretch: this.minPercent > 1
			};

			this.$image.trigger('crop.' + pluginName,  [this.result]);
		}
		,fill: function(value, target, container) {
			if (value + target < container) {
				value = container - target;
			}
			return value > 0 ? 0 : value;
		}
	});

	$.fn[pluginName] = function(options, key, value) {
		if ($.type(options) === 'object') {
			return this.each(function() {
				var obj;
				if (!(obj = $.data(this, pluginName))) {
					var  $this = $(this)
						,data = $this.data()
						,opts = $.extend({}, options, data)
						;
					obj = new Crop($this, opts);
					$.data(this, pluginName, obj);
				}
			});
		} else {
			var crop = this.eq(0);
			if (options === 'option') {
				if ($.type(value) === 'undefined') {
					return crop.options[key];
				} else {
					crop.set(key, value);
					return crop;
				}
			} else {
				return crop ? crop : this;
			}
		}
	};

	$[pluginName] = function(image, options) {
		if (typeof image === 'string') {
			image = $(image);
		}
		return new Crop(image, options);
	};

	$.fn[pluginName].defaults = {
		 width: 320
		,height: 180
		,zoom: 10
		,controls: null	// the whole div that appears on hover or null for the default
	};

	if (typeof $.getStartEvent == 'undefined') {
		$.fn.getStartEvent = function() {
			return 'mousedown';
		};
	}
	if (typeof $.getEndEvent == 'undefined') {
		$.fn.getEndEvent = function() {
			return 'mouseup';
		};
	}
	if (typeof $.getMoveEvent == 'undefined') {
		$.fn.getMoveEvent = function() {
			return 'mousemove';
		};
	}
})(jQuery);
