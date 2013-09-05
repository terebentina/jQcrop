# jQCrop

Easy to use jQuery plugin for zoom & pan image cropping. This plugin is a rewrite of https://github.com/adriengibrat/jQuery-crop which itself is a rewrite of https://github.com/blackbiron/jWindowCrop :)

The main addition to this plugin is the ability to set the options after initialization and have the plugin auto-recalculate offsets and crop sizes, along with the auto-repositioning of the image (if required).

It's built in the style of [sco.js](https://github.com/terebentina/sco.js) library so if you're familiar with that, you should feel at home with this one too.

## Usage

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
## Options

<table>
	<tr>
		<th>Option</th>
		<th>Type</th>
		<th>Default</th>
		<th>Required</th>
		<th>Description</th>
	</tr>
	<tr>
		<td>width</td>
		<td>integer</td>
		<td>320</td>
		<td>no</td>
		<td>Width in pixels of the cropping window</td>
	</tr>
	<tr>
		<td>height</td>
		<td>integer</td>
		<td>180</td>
		<td>no</td>
		<td>Height in pixels of the cropping window</td>
	</tr>
	<tr>
		<td>zoom</td>
		<td>integer</td>
		<td>10</td>
		<td>no</td>
		<td>Number of incremental zoom steps. With the default of 10, you have to click the zoom-in button 9 times to reach 100%.</td>
	</tr>
	<tr>
		<td>controls</td>
		<td>string/jquery</td>
		<td>null</td>
		<td>no</td>
		<td>If not null, this is the entire html block that should appear on hover over the image for instructions and/or buttons (could include the zoom in/out buttons for example). If null, the default html block is used which has the text "Click to drag" and the zoom in/out buttons. Use '' (or false) if you don't want anything to appear.</td>
	</tr>
</table>

## Event

To get crop results, bind a function on the crop event or read the object's result property (see below)

## Advanced

A reference to the crop object can be accessed like so:
```javascript
	var crop = $('img.crop').data('jQcrop');
	console.log(crop.results);
```
You then have access to all the properties and methods used for that specific element.
Most important is that you can alter the width/height and have the plugin auto-recalculate the crop results and auto-resize:

```javascript
	var crop = $('img.crop').data('jQcrop');
	crop.set({width: 300, height: 300});
```
