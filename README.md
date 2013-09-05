# jQCrop

Easy to use jQuery plugin for zoom & pan image cropping. This plugin is a rewrite of https://github.com/adriengibrat/jQuery-crop which itself is a rewrite of https://github.com/blackbiron/jWindowCrop :)

The main addition to this plugin is the ability to set the options after initialization and have the plugin auto-recalculate offsets and crop sizes, along with the auto-repositioning of the image (if required).

It's built in the style of (sco.js)[https://github.com/terebentina/sco.js] library so if you're familiar with that, you should feel at home with this one too.

Usage
=====
```javascript
	$('img.crop').scojs_crop({
		 width: 600
		,height: 300
	}).on('crop', function(e, data) {
			console.log('coordinates: ' + data);
			if (data.stretch) {
				console.log('image too small!!!!');
			}
	});
```
