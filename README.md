The `alt` attribute is the HTML feature with the strongest association with accessibility. It’s been around since the HTML 2.0 specification ([RFC 1866](https://tools.ietf.org/html/rfc1866), finalized in 1995), [which noted](https://tools.ietf.org/html/rfc1866#section-5.10) that “user agents may process the value of the ALT attribute as an alternative to processing the image resource indicated by the SRC attribute.” The attribute is well known even among people with an otherwise limited knowledge of HTML. Get into a group discussion about how to best achieve accessibility on the web, and people will excitedly yell “Alt text!” or, imprecisely, “Alt tags!” Note that `alt` is an attribute on the image tag, `<img>`, and not a tag itself. In the extreme, `alt` attributes are mistaken for image accessibility itself: *Include `alt` attributes, and your images are accessible. Exclude them, and they’re not.*

In this post, I will present two methods for delivering accessible images on the Web. The first method addresses the classic accessibility problem that `alt` attributes only partially address: preparing text-based descriptions and enhancements for all images, that serve all users. The second method ensures that images themselves are accessible.

## Three Limitations to `alt` Attributes

You have to admire the `alt` attribute: for a simple language feature, it’s done an incredible job of encouraging people to consider accessibility when they write and design for the web. If you’re new to HTML, here is an image tag presented with an `alt` attribute:

    <img src="puppy.jpg" alt="Photo of a cute puppy." />

In the technical terms of HTML, `alt` is an attribute, as is `src` (source). `puppy.jpg` and `Photo of a cute puppy.` are referred to as values, or sometimes as attribute-values. And `img` is the tag, enclosed in angle brackets. (I prefer XML-style syntax, so I self-close image tags: `<img />`, but in HTML5 `<img>` is also acceptable.)

To understand why `alt` attributes alone are insufficient for accessible image presentation, consider their three limitations:

1. **Content**: HTML limits attribute values to plain text; *Photo of a cute puppy* in the example above. None of the semantic tags that make for more accessible, expressive content elsewhere in HTML can be used inside of an attribute, `alt` or otherwise. You can’t, for example, use within an attribute value an `<em>` tag for providing emphasis on a portion of your `alt` attribute’s text, like `Photo of a <em>cute</em> puppy` (for an exceptionally cute puppy), nor can you write the `<a>` (anchor) tag to link to a fuller description of the image.

2. **Discoverability**: an `alt` attribute is not [palpable content](http://www.w3.org/TR/html5/dom.html#palpable-content), the way the text of an HTML paragraph or heading element is: `<h1>Palpable Content</h1>`. Ironically, the value of the `alt` attribute is *inaccessible* for many people. Unless someone is using an assistive device, like a screen reader, or viewing the page under error conditions, such as when an image fails to load for whatever reason, the presence of `alt` text is impossible to detect without examining the source code. The contents of an `alt` attribute will not aid, as an example, someone who can read text on screen if it’s sized large enough, but who does not have the fidelity of vision to make out the finer features of a photograph, chart, map, illustration, or other visual material. Certain browsers may render the contents of the `alt` attribute when an image is hovered over, but that’s little help to people on touch screen devices, which cannot detect a hover state.

3. **Length**: certain browsers render only the first 100 or so characters of an `alt` attribute, particularly in tool-tip text shown to users upon hovering their pointers over images in certain browsers on certain operating systems (an impossibility on touchscreen devices, of course, which do not yet have a hover state for your finger). In testing on the most recent version (9.1) of Safari on OS X, I found that `alt` text will not be displayed in place of a broken image if the text runs longer than one line, based on the dimensions of the broken image as specified in HTML or CSS. Keeping `alt` text accessible means keeping it short. The `<img>` element had another attribute, `longdesc` (long description), which posed even more discoverability problems than `alt`, as not even an error condition revealed its presence. It was also often misused. HTML authors would stuff even more plain-text, descriptive content into the `longdesc` attribute, but the specification actually required a URL pointing to a location for the long description’s content. For those reasons, `longdesc` is [obsolete in HTML5](http://www.w3.org/TR/html-markup/img.html), with HTML authors being directed instead to provide a link to descriptive content via a vanilla anchor tag (`<a>`).

When I write `alt` attributes, I always begin with the kind of image: *Photo of...*, *Map of...*, *Chart illustrating...*, and then give the shortest possible description of what the image is. Any content beyond that is more properly delivered to all users, using semantic elements that I’ll describe next.

## HTML Structure Around Images

Another problem with images generally is somehow grouping them. It’s not uncommon to see markup something along the lines of:

    <div class="photo">
      <img src="flowers.jpg" alt="Photo of flowers." />
    </div>

Not only does that provide a styling hook in CSS (`div.photo` or just `.photo`), but it lends itself to including a caption of some sort in a paragraph element:

    <div class="photo">
      <img src="flowers.jpg" alt="Photo of flowers." />
      <p>
        Flowers growing in a box just outside my office window.
      </p>
    </div>

The limitation to that markup is that `<div>` is a generic element, indicating only a division; adding a class of `photos` makes sense to human readers of the source code, but it has no special meaning to browsers or assistive devices. In the frank words of [the HTML5 specification](https://www.w3.org/TR/html5/grouping-content.html#the-div-element), “the `div` element has no special meaning at all” and therefore is “an element of last resort.” There is also no clear, structural indication that the paragraph inside of the `<div>` functions as a caption.

HTML5 introduced [the `<figure>` element](http://www.w3.org/TR/html/grouping-content.html#the-figure-element), which is "used to annotate illustrations, diagrams, photos, code listings, etc.” `<figure>` also comes with a semantic child element, called `<figcaption>`. Here I’ve rewritten the example above with these new semantic elements:

    <figure class="photo">
      <img src="flowers.jpg" alt="Photo of flowers." />
      <figcaption>
        Flowers growing in a box just outside my office window.
      </figcaption>
    </figure>

Unlike `<div>`, `<figure>` has a clear and well understood meaning to browsers and assistive devices. The location of `<figcaption>`, as a child of the `<figure>` element, provides a strong, structural association to browsers and assistive devices that the caption is specifically for the media inside of the `<figure>` element: the `<img>` tag, in this case. And unlike the `alt` attribute, `<figcaption>`, as palpable content, is discoverable to all users.

However, older browsers, particularly Internet Explorer prior to version 9, do not understand

CSS should include this:

    /* CSS */
    figure,figcaption { display: block; }

## ARIA Attributes

But it’s possible to create even stronger structural associations between `<figure>` and `<caption>` through the user of Accessible Rich Internet Application (ARIA) attributes.

The first ARIA attribute is `aria-labelledby` (note the British spelling of *labelled*). The value of that attribute must be a unique ID on some other element. In this case, `<figcaption>` serves as the label, so I’ve added `id="flower-caption"` to it, and then put `flower-caption` as the value of `aria-labelledby`:

    <figure class="photo" aria-labelledby="flower-caption">
      <img src="flowers.jpg" alt="Photo of flowers." />
      <figcaption id="flower-caption">
        Flowers growing in a box just outside my office window.
      </figcaption>
    </figure>

The WAI-ARIA spec notes that the “`aria-labelledby` attribute is similar to `aria-describedby` in that both reference other elements to calculate a text alternative, but a label should be concise, where a description is intended to provide more verbose information.”

To make that information discoverable to all users, I’ve added a simple *Full description* link that points elsewhere on the page, using the `#`-style fragment identifier, which will scroll the browser to the content in question:

    <figure class="photo" aria-labelledby="flower-caption" aria-describedby="content">
      <img src="flowers.jpg" alt="Photo of flowers." />
      <figcaption id="flower-caption">
        Flowers growing in a box just outside my office window. <a href="#content">Full description.</a>
      </figcaption>
    </figure>

I’ve added the following CSS to highlight the descriptive content on the page, using the `:target` pseudoclass that will be applied when someone clicks the *Full description* link. This little enhancement will be especially useful in cases where a layout would not require scrolling, and therefore leave a user wondering why I’d included an apparently non-functional link in the figure caption:

    /* CSS */
    #content:target {
      background: #DDD;
      transition: background 1s;
    }

## Accessible Images

Now that the text content of the page has been strongly, accessibly associated with the image, I want to turn to the image itself. Prior to the original iPhone’s release in 2007, handling images on the web was a fairly straightforward thing. People were generally designing fixed-with layouts, usually at about 960 pixels wide, and creating images of a specific width to fit within those layouts. A pixel was a pixel, and that was that.

Things got even more complicated with the release of the iPhone 4, which introduced what Apple called a “retina” display, which roughly doubled the number of pixels per inch that made up its screen. However, even though the number of pixels increased, the device itself behaved as though it were still 320 pixels wide. That was the dawn of the pixel-doubled image, which has now gone on to be pixel-tripled on certain devices. And far from behing a phone-only display feature, high-density displays are available all the way up to desktop sizes on 4K and, in the case of the 27” Retina iMac, 5K displays.

So the challenge is to get the right-sized image, at the proper pixel density, to the correct device. Eventually we can expect a [Network Information API](https://w3c.github.io/netinfo/) that will allow users and/or their browsers to choose images based on bandwidth as well, so a pretty but unnecessary retina-quality image doesn’t eat up someone’s mobile data plan.

[HTML5](http://www.w3.org/TR/html5/), also known as [HTML: The Living Standard](https://developers.whatwg.org) or, as I like to call it, [Plain Old Semantic HTML](http://microformats.org/wiki/posh) (POSH),

W3C Links:
HTML5 Spec: 4.7.1.1 Requirements for providing text to act as an alternative for images



WebVTT:
https://w3c.github.io/webvtt/

Yes, you should write `alt` attributes in your `<img>` tags. But no, you must not stop there, if your aim is an accessible presentation of images on the web. The richest expressions of web accessibility are those that enrich the experience of a page or site for all users, regardless of ability.
