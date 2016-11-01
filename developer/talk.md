https://www.w3.org/Style/CSS/current-work
https://www.w3.org/standards/techs/css#w3c_all


Regions
https://jsfiddle.net/nprzwko7/


WHATWG

https://figures.spec.whatwg.org
Living Standard — Last Updated 19 May 2015
CSS Figures


https://books.spec.whatwg.org
Living Standard — Last Updated 7 April 2015
CSS Books


https://quirks.spec.whatwg.org
Living Standard — Last Updated 6 July 2016
Quirks Mode

W3C

https://www.w3.org/TR/motion-1/
Motion Path Module Level 1

* motion-path
* motion-offset
* motion-rotation
* motion

https://jsfiddle.net/35qjnx8m/9/
https://jsfiddle.net/35qjnx8m/11/

---

Non-element Selectors
можно селектить ноды атрибутов, например

---

CSS Round Display Level 1
W3C Working Draft, 1 March 2016
https://www.w3.org/TR/css-round-display-1/

https://github.com/anawhj/jRound/blob/master/README.md
http://www.openwebosproject.org/

Boot 2 Gecko B2G, Firefox OS
https://www.mozilla.org/ru/firefox/os/
Dec 8, 2015 
Mozlando
Farewell Firefox OS smartphones. Mozilla today announced an end to its smartphone experiment, and said that it would stop developing and selling Firefox OS smartphones. It will continue to experiment on how it might work on other connected devices and Internet of Things networks.
http://gioyik.com/p/raspberrypi-final-state — Raspberry PI B2G

Hi! I want to ask — if there any official smart watches on FF OS? And is there any plans for implementation of CSS Round Display specification? (https://drafts.csswg.org/css-round-display/)
Nothing so far & might not be in future.

2012 HP открыла код webOS
2013 LG купила исходники
2014 первый анонс часиков на webOS
CES 2015 — представили часы на webOS
LG Wearable Platform == webOS


@media
device-radius [ <length> | <percentage> ]
screen and (device-radius: 50%)
Надо что бы отличать квадратный и круглый экран


shape-inside: [ auto | outside-shape | [ <basic-shape> || shape-box ] | <image> | display ]
shape-inside: display;
Ограничиваем контент круглым дисплеем

border-boundary
border-boundary: [ none | parent | display ]

polar-angle [ <angle> ] — угол поворота
polar-distance — расстояние от начала координат
polar-origin [ <position> | auto ] — начало координат
polar-anchor [ 50% 50% ] — точка объекта относительно которой позиционируется всё


---

CSS Text Module Level 4
W3C First Public Working Draft, 22 September 2015
https://www.w3.org/TR/css-text-4/

text-spacing

text-space-collapse
text-space-trim
text-wrap

wrap-before
wrap-after
wrap-inside

white-space

hyphenate-character — знак переноса
hyphenate-limit-zone — максимальный размер гребенки
hyphenate-limit-chars — минимальное количество знаков в слове для переноса
hyphenate-limit-lines — количество строк с переносами идущих подряд
hyphenate-limit-last — поведение переносов в конце колонок, страниц

---

CSS Scoping Module Level 1
W3C First Public Working Draft, 3 April 2014
https://www.w3.org/TR/css-scoping-1/

@scope {}

:scope 

:scope-context()

:host, :host(), b :host-context() 

::shadow 

::content

::region




CSS Lists and Counters Module Level 3
W3C Working Draft, 20 March 2014
www.w3.org/TR/css-lists-3/

::marker — нигде
marker-side 	list-item | list-container
list-style-type: "★"; — FF!
counters() — работают! можно строить вложенные списки с нормальной нумерацией.


CSS Pseudo-Elements Module Level 4
https://drafts.csswg.org/css-pseudo-4/#marker-pseudo

:: — псевдоэлемент
: — псевдокласс

# Typographic Pseudo-elements
::first-line
::first-letter


#Highlight Pseudo-elements

::selection
::inactive-selection
::spelling-error
::grammar-error

#Generated Content Pseudo-elements

::before
::after
::marker 
::placeholder


Разбиение по страницам

widows/orphans

http://codepen.io/SilentImp/pen/jAvBxQ (открыть предпросмотр печати)
http://codepen.io/SilentImp/pen/rLkmRW (и так видно)


letter/word spacing
http://codepen.io/SilentImp/pen/LkJLkX?editors=1100

CSS Scroll Snap Module Level 1
https://drafts.csswg.org/css-scroll-snap/

http://codepen.io/SilentImp/pen/akawYQ
http://codepen.io/SilentImp/pen/akawxr/


CSS Custom Properties for Cascading Variables Module Level 1
https://drafts.csswg.org/css-variables/

--*

:root {
  --main-color: #06c;
  --accent-color: #006;
}

#foo h1 {
  color: var(--main-color);
}

http://codepen.io/SilentImp/pen/jAvLPz



Selectors Level 4
https://drafts.csswg.org/selectors/

E:not(s1, s2)
E:matches(s1, s2)
E:has(rs1, rs2)
E[foo="bar" i]
E:dir(ltr)
E:lang(zh, "*-hant")
E:any-link
E:scope
E:current
E:current(s)
E:past
E:future
E:drop
E:drop(active)
E:drop(valid)
E:drop(invalid)
E:read-write
E:read-only
E:placeholder-shown
E:default
E:checked
E:indeterminate
E:valid
E:invalid
E:in-range
E:out-of-range
E:required
E:optional
E:user-error
E:root
E:empty
E:blank
E:nth-child(n [of S]?)
E:only-child
E:nth-of-type(n)
E:nth-last-of-type(n)
E:first-of-type
E:last-of-type
E:only-of-type
E F or E >> F
F || E
E:nth-column(n)
E:nth-last-column(n)

https://drafts.csswg.org/css-images-4/
element
http://codepen.io/SilentImp/pen/wWEqpm



CSS Containment Module Level 3
https://drafts.csswg.org/css-containment/

