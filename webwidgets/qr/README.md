# QR Code Web Widget

A simple web widget for showing any QR code (URL) of choice.

## Usage

You can define the QR code URL by sending it as a URL parameter to this web page, like so:

```
https://cisco-ce.github.io/roomos-samples/webwidgets/?url=random.dog&title=Random%20Dog
```

## Customizations

You can also customize widget further with more URL parameters:

<table>
<tr>
  <th>Parameter</th>
  <th>Default</th>
  <th>Description</th>
</tr>
<tr>
  <td>url</td>
  <td>https://cisco.com</td>
  <td>The URL you want your QR code to show. Remember to <a href="https://www.urlencoder.org/">encode it</a> if it contains special characters.</td>
</tr>
<tr>
  <td>title</td>
  <td>(Blank)</td>
  <td>Short title of where the QR code will take you (remember, a casual user cannot guess this).</td>
</tr>
<tr>
  <td>text</td>
  <td>(Blank)</td>
  <td>More description, if needed. Can also contain HTML.</td>
</tr>
<tr>
  <td>accent</td>
  <td>black</td>
  <td>The accent color using CSS color names (default black / #000000).</td>
</tr>
<tr>
  <td>background</td>
  <td>white</td>
  <td>The background color of the QR code. Can also be transparent.</td>
</tr>
</table>

## Disclaimer

This web widget is made as an example only, for testing and demo purposes. You should not use it as a production app.