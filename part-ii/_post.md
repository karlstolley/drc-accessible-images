# Image Accessibility, Part II: Beyond src Attributes

In [Part I one of this series](http://www.digitalrhetoriccollaborative.org/2016/06/15/image-accessibility-part-i-beyond-alt-attributes/), I looked at writing semantic HTML and ARIA attributes to take image accessibility well beyond the limitations of the `alt` attribute. Presenting images with text-based descriptions and enhancements that serve all users is an essential foundation for image accessibility. That foundation must be in place before pursuing any of the techniques in this post, which looks at the limitations of the `src` attribute for accessibly delivering images in an era of responsive web design.

To make images themselves accessible requires delivering a crisp, high-fidelity image that best suits the device and preferences of each sighted visitor to a site, but that also does not require any more bandwidth than is absolutely necessary. The accessibility challenge is therefore to deliver the right-sized image to any given device. That is a matter of understanding how screens and browsers work when displaying images, as I describe below, and what display preferences a user might specify to determine how images are presented. While the delivery of better-accessible images is currently limited to screen conditions, a [Network Information API](https://w3c.github.io/netinfo/) is in development that will allow users to specify how their browsers behave under certain network conditions as well. In the case of accessible images, that API should help ensure that a stunning but unnecessary image doesn’t consume someone’s mobile data plan or bring a slow internet connection grinding to a halt. The techniques presented below anticipate the network API, and may very well work without any further adjustment.

Before diving into the new HTML elements and the limitations of the `src` attribute that they attempt to solve, I’m going to walk through some recent history and foundational technical concepts behind bitmapped images. Many things have changed, particularly the pixel, which add to the complexity of the fundamentally new approach to designing for the web known as responsive web design (RWD).

## Images and Responsive Web Design

The preparation and delivery of web images used to be simple. Web designers typically designed fixed-width page layouts, usually around 960 pixels wide. They prepared image files of a specific height and width to fit within the fixed layout and referenced the URL or path to the file in the `<img>` tag’s `src` attribute. To prevent jarring shifts in page layout once an image loaded, the image’s placeholder dimensions were often specified in `height` and `width` attributes on the `<img>` tag. On the user side, images all rendered on desk- or laptop screens with a pixel density of roughly 96 pixels per inch. So long as an image was prepared with appropriate brightness and contrast, and not excessively compressed, it was safe to consider the image more or less accessible to sighted users (colorblindness and treatment of the image’s subject matter notwithstanding).

Apple’s release of the iPhone in 2007 was also the birth of a viable mobile web, which had failed to develop in the era of feature phones. Apple’s approach to displaying fixed-width website layouts on the original 320 × 480 iPhone screen was arguably the most important design decision in pushing the mobile web forward. Specifically, Apple designed its mobile Safari web browser to behave as though the phone screen were 980 pixels wide: large enough to display the entire, zoomed-out contents of 960-pixel fixed-width layouts. iPhone users needed only to double-tap page elements or use a zoom gesture to fill more of the native phone viewport. Other smartphone browsers quickly followed Apple’s lead and rendered pages in a similar fashion. But in terms of image data, that meant a lot of overhead: phones with native resolutions of around 320 × 480 pixels were routinely loading images with three or more times as many pixels as their screens could actually display, devouring mobile data plans and degrading device and network performance in the process.

With rapid, widespread adoption of smartphones came an interest in designing websites specifically for the mobile screen. Sites with large budgets responded by creating special mobile versions of their sites. But in 2010, Ethan Marcotte introduced the concept of [responsive web design](http://alistapart.com/article/responsive-web-design). Well executed responsive web design (RWD) enables web designers to design a site from a single CSS file that will render beautifully on all screens, from the tiniest phone to a widescreen television set and everything in between. No special mobile site or mobile URL required.

Responsive web design unites three techniques: fluid grids, CSS3 media queries, and flexible images. Briefly:

1. **Fluid grids** are expressed in CSS as percentages, rather than fixed pixel units, and enable text content to reflow relative to browser viewport sizes. Percentage units have been available from [the very first version of CSS](http://www.w3.org/TR/REC-CSS1/#percentage-units). Although long championed by accessibility advocates, percentage units are accesible in terms of text line-length only within a certain, narrow range. For example, at the size of a phone screen, a single column of text should probably be close to 100% of the viewport, [the technical term](https://developer.mozilla.org/en-US/docs/Glossary/Viewport) for the area of a browser where page content is rendered. But on even a modest-sized laptop, text areas sized to 100% of the viewport in a maximized browser window could make for uncomfortably long lines of text for someone to read.

2. [**Media queries**](http://www.w3.org/TR/css3-mediaqueries/), [specified in as a module for CSS3](http://www.w3.org/Style/CSS/specs.en.html), provide the means for browsers to apply specific CSS styles only under certain conditions, such as a minimum size of the browser’s viewport. Media queries are therefore perfect for adjusting the percentage-widths of fluid grids at different screen sizes. For example:

        /* CSS */
        /*
          Content area sized at 95% at mobile scales, outside
          of any media query:
        */
        #content {
          width: 95%;
          margin: 0 auto; /* Visually center #content area */
        }
        /*
          Query for viewports larger than 700px wide:
        */
        @media screen and (min-width: 700px) {
          /*
            if the screen is 700px or larger, size content area
            to be 66.667%:
          */
          #content {
            width: 66.667%;
            margin: 0 11.111% 0 22.222%; /* Left offset for #content area */
          }
        /*
          Closing bracket from the media query:
        */
        }

Media queries apply the CSS rules they contain only under certain conditions. In that example, `#content` is sized at 66.667% only if the browser viewport is at least 700 pixels wide. For a more accessible query, [it’s generally better to specify em units rather than pixels](http://zellwk.com/blog/media-query-units/). In most browsers, 1em = 16px, so the query could be rewritten as `(min-width: 43.75em)`. That has the advantage of drawing layouts based on how large someone has zoomed the text, an accessibility preference of the user, rather than the arbitrary pixel-width of their device. And pixel-widths of devices are exceptionally arbitrary, as [a chart of iPhone models shows](http://www.paintcodeapp.com/news/ultimate-guide-to-iphone-resolutions). In the early days of RWD, designers too often used the screen sizes of the iPhone and iPad to determine the `min-width` breakpoints of a design. A much better practice is to view your design in progress using something like the [responsive design mode in Firefox](https://developer.mozilla.org/en-US/docs/Tools/Responsive_Design_Mode). After observing how the design reacts to different sizes, it’s simple to specify exacting breakpoints based solely on stress points in the design, where elements are no longer sized appropriately or the grid begins to fall apart. A design will always look its best relative to itself. Forget about how big next year’s iPhone screen is.

3. **Flexible images**. Flexible images require removing from image tags any `height` and `width` attributes and instead controlling the size of images purely through CSS:

        /* CSS */
        img {
          display: block;
          max-width: 100%; /* Image only as big as its containing element */
        }

Those two lines of CSS ensure that images are displayed as blocks, rather than inline (the default on most browsers), and that images never exceed the width of their containing elements, such as the `<figure>` element I described in Part I.

But before going any further on handling images in responsive web design, I need to stop and point out some significant changes to screens and their impact on the fundamental unit of computer displays and bitmapped images: the pixel.

## Pixel Problems

The 2010 release of the iPhone 4 introduced what Apple called a [Retina display](https://support.apple.com/en-us/HT202471). On Retina displays, or what I’ll refer to from here on as high-density displays (HDDs), the number of pixels per inch that make up the device’s screen increase from a traditional 96ppi to 192ppi and beyond. The kicker is that to prevent text, icons, and images from appearing microscopic, HDDs size on-screen elements *as though* the display were a traditional 96dpi display. And that means that a pixel is no longer a pixel.

There are now effectively two kinds of pixels in the world, hardware pixels and reference pixels. [This post by Scott Kellum](http://alistapart.com/article/a-pixel-identity-crisis) has a full rundown that I will only summarize here:

* **Hardware pixels** are the old, familiar concept of the pixel: the actual dots of light on the screen of a monitor or device. A standard 96ppi 1024 × 768 monitor featured exactly 1024 pixels/dots of light across, and 768 points on the vertical. A 1024 × 768 image file would would perfectly cover the screen.
* **Reference pixels** are, in [the W3C’s definition](http://www.w3.org/TR/css-values/#reference-pixel), “the visual angle of one pixel on a device with a pixel density of 96dpi and a distance from the reader of an arm’s length.” Don’t try to parse that; I’ll explain. The HDD/retina display on iPhone 4 featured 640 × 960 hardware pixels. But it continued to render onscreen elements as though the display were 320 × 480. The iPhone 4 remained the same size as early iPhones, 320 × 480, but in *reference* pixels. That meant, for example, that a comfortable-to-tap 120 × 120-pixel icon on an an older iPhone would still render at an apparent 120 × 120 size on the iPhone 4, rather than rendering at 60 × 60 in hardware pixels, which would be challenging to tap precisely and comfortably.

In other words, on high-density displays, multiple hardware pixels must light up in order to fill the space of one reference pixel. That’s why high-density displays look so crisp. Multiple points of light (hardware pixels) are doing the job of a single reference pixel, meaning that the jagged stair-step look of text found on lower-resolution displays is eliminated, provided that the device is rendering mathematical curves, as is the case with fonts as well as vector graphics.

The trouble is, bitmapped images are grids of pixels, not mathematical curves. HDDs attempt to maintain the apparent, reference-pixel size of bitmapped image files, which are just a grid of pixels. But images lacking in enough hardware pixels look like garbage on HDDs. A perfectly crisp 320 × 480 background image on an older iPhone 3GS, whose hardware and reference pixels were matched at 320 × 480 (1:1), rendered as a blurry mess on the iPhone 4 because one pixel in the image file needed to fill the space of two reference pixels (1:2) in each dimension. It was the same visual consequence of using an image editor to reduce an image to half its dimensions, then blowing it back up to its original size, and introducing some pixel smoothing to avoid the blocky pixelated look of bitmapped images that have been scaled up.

Bitmapped images have to match the display’s hardware pixels to look crisp on high-density displays: a wallpaper on an iPhone 4 required an image file with 640 × 960 pixels (2:1). Same with old 120 × 120 reference-pixel app icons, which needed to be re-prepared as 240 × 240 hardware pixels in order to appear crisp at 120 × 120 reference-pixel rendering (2:1). Or in web design terms, an image file specified to display as `width: 200px` (or the `%` or `em` equivalent of 200 pixels) in CSS must be at least 400 pixels wide to look good on an HDD. CSS dimensions are in reference pixels. Image file dimensions are in hardware pixels.

## Fixing the Problems of a Single `src` using `srcset`

I know. That’s a lot of material to digest. But to simplify and quickly review: images on the web no longer display at a single size across all screens, and high-density displays require image files with more pixels than do standard-density displays.

To refresh, [this page repeats the example from Part I](https://karlstolley.github.io/drc-accessible-images/part-ii/hank-original.html). It also uses a small bit of JavaScript to show, in the corner of the image, the name of the file that it’s accessing. Even in that largely non-responsive example, `srcset` could be used to specify pixel-doubled and even -tripled versions of the image for higher-density displays:

    <img srcset="hank-super-hd.jpg 3x, hank-hd.jpg 2x, hank.jpg 1x"
      src="hank.jpg"
      alt="Photo of Hank the dog." />

[The Mozilla Developer Network documentation for `srcset`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-srcset) notes that a `srcset` attribute contains a comma-separated list of image sources. Optionally, as in the example above, each source can be followed by a space and a pixel-density descriptor: `3x` for pixel-tripled, `2x` for pixel-doubled, and `1x` for standard screens. The `<img>` tag must also contain a vanilla `src` element, as the example above shows, for browsers that do not understand the `srcset` element. My preference is always to put the lowest-resolution version of the image in the `src` element, with the assumption that a less-capable browser is probably on a lower-resolution screen and possibly also on a lower-bandwidth network connection.

Although the pixel-density descriptors make for a nice introduction to `srcset`, I find them to be of limited use unless an image is displayed at essentially the same size across all versions of the design. In responsive design, that’s rarely the case. Here is [the same example from Part I, but with a basic responsive design](https://karlstolley.github.io/drc-accessible-images/part-ii/hank-src.html). I recommend you look at it using Firefox and its [responsive design mode](https://developer.mozilla.org/en-US/docs/Tools/Responsive_Design_Mode), dragging the viewport to different dimensions. Or if you’re lazy or on a non-windowed device, you can see the effect in this [YouTube video of the responsive, `src`-based example](https://www.youtube.com/watch?v=0yHJCmbNbtM). It’s not a very sophisticated design, I admit, but it goes from a single-column at smaller sizes to a two-column design, finally to a three-column design with the image occupying two columns.

And that example is still just using a `src` element. That’s a good place to begin when designing for responsive images. It’s important to see how the design behaves as the viewport expands and contracts before taking on the work of preparing a set of responsive images.

When I design responsively, I start by looking at the columns of text and finding the spots where the line length gets to be too long or too short. And I always begin by designing for a narrow, mobile-scale screen. In the design with this example, given the font size I’d chosen (18px or 1.125em), lines of a single column of text became more difficult to read when the viewport was much wider than 620 pixels. Wishing to avoid a too-long line length on some of the fallback typefaces in my CSS, I walked that back to a conservative 600 pixels, or 37.5em at a default 16px em unit. At that point, the layout splits into two equal columns, which makes sense given that the image is about as important as the text in the example.

Stretching the viewport open further, I noticed that at around 1050 pixels, the block of text started to run significantly shorter down the column compared to the height of the image. So I dropped in [another media query in my CSS](https://github.com/karlstolley/drc-accessible-images/blob/gh-pages/part-ii/assets/css/screen.css#L74) at 1050px/65.625em, at which point I wanted the layout to be three equal columns, with the image taking up two of the three columns.

With that information in hand, I could do some very basic math to determine the sizes at which my image would display. In the single-column layout, on a traditional/non-HDD screen, the image would never be sized larger than 600 pixels. In a two-column layout, the image would be as small as 300 pixels (50% of 600 pixels), but never be larger than 525 pixels (50% of 1050px, the next break point). And in a three-column layout, the image would be as small as 700 pixels, with no theoretical upper limit, apart from that of the original image itself, 3264 pixels wide straight off my iPhone’s camera.

So, I made a little list of image sizes that I’d need, in hardware pixels/1x. I used the raw numbers from my calculations, with the exception of the 700-pixel image from the smallest possible 3-column layout, which I increased somewhat arbitrarily to 750 pixels:

     300 /  150 @2x /  100 @3x
     600 /  300 @2x /  200 @3x
     750 /  375 @2x /  250 @3x
    1200 /  600 @2x /  200 @3x
    1500 /  750 @2x /  500 @3x
    2000 / 1000 @2x /  666 @3x
    3264 / 1632 @2x / 1088 @3x

I also noted the reference pixel sizes at 2x, with the 3x sizes largely for trivia’s sake. I’m unaware of any 3x screens on anything but large phones, but 4K and 5K displays (roughly 2x) are appearing on desktops now.

So I took that list to my image editing software, and made a set of resized images based on the 3264-pixel original of Hank. After testing a wide range of compression rates on a single mid-sized image, I then saved each file at three different compression rates: 80%, 60%, and 30% (lower numbers = higher compression in my image editor). I then spot-tested each image on both a Retina iMac and a traditional/1x display. What I discovered were that the very large versions of the image (1200px and wider) withstood higher compression rates without any noticeable loss in quality, especially when displayed on a high-density display. HDDs make it harder to see the compression artifacts and loss of image quality typical of extreme levels of compression, with so many pixels in play.

Here is the list of the 8 images I ultimately selected from the 21 I’d prepared for experimentation, along with their file sizes both in bytes and kilobytes, with the `hank-original.jpg` image representing the bandwidth-crushing 3.4 megabyte image coming off the iPhone:

    hank-300-80.jpg   /   49855 bytes /  50 Kbytes
    hank-600-60.jpg   /  110509 bytes / 111 Kbytes
    hank-750-60.jpg   /  161393 bytes / 161 Kbytes
    hank-1200-30.jpg  /  153540 bytes / 154 Kbytes
    hank-1500-30.jpg  /  223007 bytes / 223 Kbytes
    hank-2000-30.jpg  /  354749 bytes / 355 Kbytes
    hank-3264-30.jpg  /  767679 bytes / 768 Kbytes
    hank-original.jpg / 3446029 bytes / 3.4 Mbytes

When I name images for use with `srcset`, I prefer to include in the file name the image’s width in hardware pixels followed by the compression rate. So `hank-1500-30.jpg` represents a 1500-pixel-wide image with high, 30% compression. I chose light, 80% compression for the very smallest file. With that few pixels on a 1x device, details in the photo were quickly lost even at 60% compression, without much savings in file size. But the 600- and 750-pixel images still looked good on a standard screen at 60% compression.

The one oddity you might notice in the list is between the 750- and 1200-pixel images. Owing to higher compression, the 1200-pixel image is actually 7853 fewer bytes than the 750-pixel image. Given that savings in file size, it might seem wasteful to include the larger 750-pixel image file. However, there is a good chance that the 750-pixel image will be used on a large traditional/1x display in viewports up to 1125 pixels wide. Under those circumstances, the lower compression will yield a better quality image relative to the small savings in file size. And once I started compressing files at 1200 pixels wide and above, I was concerned primary about their performance on 2x and possibly 3x displays. Higher compression made more sense, particularly because a traditional display’s browser viewport would have to be sized at a whopping 1800 pixels wide to render a pixel-for-pixel version of the 1200-pixel wide image. Possible? Yes. Worth the additional bandwidth a low-compression, 1200-pixel-wide image would consume? No.

Putting all of those files into the `srcset` attribute looks like this:

    <img srcset="hank-3264-30.jpg 3264w, hank-2000-30.jpg 2000w, hank-1500-30.jpg 1500w, hank-1200-30.jpg 1200w, hank-750-60.jpg 750w, hank-600-60.jpg 600w, hank-300-80.jpg 300w"
      sizes="(min-width: 1050px) 66vw, (min-width: 600px) 50vw, 100vw"
      src="assets/img/hank-300-80.jpg"
      alt="Photo of Hank the dog." />

There’s an additional attribute there that I’ve not yet mentioned: `sizes`. When using `srcset` to do more than specify pixel densities (e.g., `2x` or `3x` in the pixel-density notation example above), the `<img>` tag requires the `sizes` attribute to give the browser clues as to how much of the viewport the image will occupy at different sizes. So this part of the source code, `sizes="(min-width: 1050px) 66vw, (min-width: 600px) 50vw, 100vw"`, reflects the little design narrative I talked through above. `(min-width: 1050px) 66vw` means that when the viewport is at least 1050 pixels wide, the image will fill 66% of the viewport width. [*Viewport width* is now a valid unit](http://www.w3.org/TR/css3-values/#viewport-relative-lengths) in the CSS specification, with 1vw = 1/100 of the viewport, so I use it directly: `66vw`. When the screen is at least 600 pixels wide, the image will be roughly 50% of the viewport, `50vw`. Otherwise, the browser should assume that the image will be 100% of the viewport, `100vw`. The browser can then use that information to select from all of the images listed in `srcset`, which are listed here with their widths, `w`, in hardware pixels. Having already included the width in my images’ file names makes writing those width units a little easier, and certainly [easier to correct later](https://github.com/karlstolley/drc-accessible-images/commit/e9910503132f5954ffec3579675ba4ff8ac0d2f9) (oops).

At present, I’m using pixel units in my `sizes` attributes, rather than the em units of my CSS’s media queries. On the browsers I’ve tested, this does not seem to negatively impact accessibility if someone zooms the text. But I think it makes more sense to keep image-related `min-width` values in pixels. In the off chance that zooming text would somehow cause a browser to choose an image smaller than needed, I’ve changed the CSS for my `img` element to use `width: 100%` instead of `max-width: 100%`. With `max-width: 100%`, a browser will stop resizing an image once it reaches its maximum reference-pixel size. `width: 100%` allows the browser to keep effectively zooming an image smaller than its parent element.

One final point worth noting: the `sizes` attribute requires that each `min-width` condition and viewport size be listed from largest to smallest, because the browser will use the first `sizes` condition that matches. I also list my images largest to smallest in `srcset`, just to stay consistent with the largest-to-smallest order of `sizes`.

You can see [the `srcset` example in action](https://karlstolley.github.io/drc-accessible-images/part-ii/hank-srcset.html) or have a look at [the YouTube video I made](https://www.youtube.com/watch?v=I62CFHkLo-M) showing different image sources loaded at different screen sizes. The exact image file is shown in a little gray box in the upper righthand corner of the image. Note that web browsers should cache and continue to use the largest image loaded even if the viewport is pulled in smaller, but the piece of JavaScript I’ve used to display the currently loaded image file prevents that behavior in the examples included here.

## Overcoming the Problems of Simple Scaling Using `<picture>`

`srcset` goes a long way toward improving bandwidth challenges inherent in image accessibility. That might be a little hard to recognize on a single page with a single image, but over a site with many pages, with many images on each page, that savings in bandwidth adds up quickly for both users and whomever pays the bills for the website being accessed.

But taking a critical eye to the image across the responsive design, it’s clear that the essential content of the image—Hank the dog, particularly his face—is difficult to discern except at very large screen sizes or when the image is nearly the full size of the viewport.

At mobile sizes, the image looks *dinky*, to use the super-technical term I teach students. The way the image was composed when I shot it, Hank himself occupies only the center third or so of the image. That’s fine when the full image is displayed at sizes closer to the 3264 pixels of the original image. But on small viewports, Hank’s face is too small to make out much detail.

Additionally, in the jump from a 599-pixel-wide viewport to a 600-pixel wide viewport, the image goes from being displayed the entire width of the browser to just half. That layout made sense in deference to the column of text, but the image again looks dinky. And while the landscape, 4:3 ratio of the image holds up fine in the single- and three-column layouts, the narrow range of displays for the 2-column design would probably look much better with an image that was in portrait orientation.

But to achieve that, we can’t use `srcset` alone. That’s why [the `<picture>` element was created](https://html.spec.whatwg.org/multipage/embedded-content.html#the-picture-element), in large measure from advocacy by the [Responsive Images Community Group](https://responsiveimages.org). `<picture>`, like the HTML5 [`<audio>`](http://w3c.github.io/html/semantics-embedded-content.html#the-audio-element) and [`<video>`](http://w3c.github.io/html/semantics-embedded-content.html#the-video-element) elements, can contain [`<source>`](http://w3c.github.io/html/semantics-embedded-content.html#the-source-element) elements, themelves with `srcset` and `sizes` attributes, to provide the kind of art direction called for when an image might be cropped or presented in different orientations, depending on the layout. I went back into my image editor and made two new sets of images, [one with a landscape crop of Hank’s face](https://github.com/karlstolley/drc-accessible-images/blob/gh-pages/part-ii/assets/img/hank-cropped-1200-30.jpg), and [another crop that was in portrait orientation](https://github.com/karlstolley/drc-accessible-images/blob/gh-pages/part-ii/assets/img/hank-tall-cropped-1050-30.jpg). My goal was to have Hank’s face be roughly the same apparent size across all images in all different configurations of the layout. Like before, I will just dump the source code from this example and walk through it:

    <picture>
      <source srcset="hank-3264-30.jpg 3264w, hank-2000-30.jpg 2000w, hank-1500-30.jpg 1500w, hank-1200-30.jpg 1200w, hank-750-60.jpg 700w"
        sizes="66vw" media="(min-width: 1050px)" />
      <source srcset="hank-cropped-1200-30.jpg 1200w, hank-cropped-750-60.jpg 750w"
        sizes="50vw" media="(min-width: 975px)" />
      <source srcset="hank-tall-cropped-1050-30.jpg 1050w, hank-tall-cropped-525-60.jpg 525w"
        sizes="50vw" media="(min-width: 600px)" />
      <source srcset="hank-cropped-1200-30.jpg 1200w, hank-cropped-750-60.jpg 750w, hank-cropped-600-60.jpg 600w, hank-cropped-300-80.jpg 300w"
        sizes="100vw" />
      <img id="hank-photo" src="hank-cropped-300-80.jpg" alt="Photo of Hank the dog." />
    </picture>

Let’s work from the bottom up. The last line before the closing `</picture>` tag is a plain old `<img>` tag with a plain old `src` element. Again, this is to help browsers that do not natively understand all of the newer HTML elements and attributes. The line above that is a `<source>` tag. It has a `srcset` attribute listing files called `hank-cropped` with some pixel and compression value, as is my naming style. Finally, there is a sizes attribute again, specifying `100vw`. All of the images in that `srcset` on that `<source>` tag will be displayed the full width of the screen.

The line above that contains another `<source>` tag with a `srcset` listing of images called `hank-tall-cropped`, also with more size and compression information in the file name. It also has a `sizes` attribute, in addition to a `media` attribute. What `<source>` does is separate the media query from the size, as in the `srcset`/`sizes` attribute on the `<img>` tag. That allows web designers to present a specific subset of images for browsers to choose from at specific screen sizes. That’s not possible in `srcset` used on the `<img>` tag directly, because any image listed in `srcset` is theoretically available for the browser to load–including in some future where the Network API is taken into account when choosing an image source.

As with the `srcset` example, each `<source>` element is listed from largest to smallest, in media-query order. Browsers will use the first source that matches the current conditions of the screen. The first `<source>` is almost identical to the `srcset` example in the previous section. But notice the second source, which has a media query of `(min-width: 975px)`. There is no breakpoint like that in my CSS for the layout. But I noticed that, for the narrow range between 975 pixels to 1049 pixels, the *cropped* version of the photo of Hank, as presented to mobile users, also worked better than the tall crop for the larger sizes of the two-column layout. So I wrote an additional `<source>` element that would deliver exactly that for `min-width: 975px`. You can [view the live example](https://karlstolley.github.io/drc-accessible-images/part-ii/hank-picture.html), or check out [the video of the example on YouTube](https://www.youtube.com/watch?v=t5C0Nb4fCFc). As a bonus, here is [a video showing how the layout and `<picture>` element behave](https://www.youtube.com/watch?v=cbFdHhO_clk) when someone simply increases the text in the browser. As the text gets bigger, it triggers layouts intended originally for smaller screens, while loading images that appropriate for the full size of the screen.

## Picturefill.js

Both `srcset` and `<picture>` are new HTML features, and there are many browsers still in circulation that do not yet natively support them. The indispensable site [Can I use...](http://caniuse.com/) keeps up-to-date information on the implementation of [`<picture>`](http://caniuse.com/#feat=picture) and [`srcset`](http://caniuse.com/#feat=srcset) in top browsers. That spotty support is why it’s essential to leave a fallback `<img>` element inside of `<picture>`, and a plain `src` attribute on `<img>` tags that use `srcset`. However, for users of browsers that do not support the new image technologies natively but that do have JavaScript enabled, Scott Jehl created a polyfill called [Picturefill](http://scottjehl.github.io/picturefill/). All that is required is to download a copy of `picturefill.js` and post it to your own site, and include a reference to it in a `<script>` tag inside your page’s `<head>` tag. Here it is presented just below the HTML5 Shiv script that I recommended in Part I:

    <head>
      <!-- Other elements removed for brevity -->
      <!--[if lt IE 9]>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.3/html5shiv.min.js"></script>
      <![endif]-->
      <script src="assets/js/picturefill.js"></script>
    </head>

That will allow users of older, JavaScript-capable browsers to benefit from accessible, responsive images immediately.





