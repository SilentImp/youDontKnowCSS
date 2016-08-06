define ['requestAnimationFramePolyfill'], ()->
  
  class slidsterController
    constructor: ->
      @enter = 13
      @esc = 27
      @dash = 189
      @ctrl = 17
      @cmd = 91
      @shift = 16
      @alt = 18
      @space = 32
      @r = 82
      
      # вверх
      @PgUp = 33
      @Up = 38
      @Left = 37
      @H = 72
      @K = 75

      # выбрать страницу
      @P = 80
      
      # вниз
      @PgDown = 34
      @Down = 40
      @Right = 39
      @L = 76
      @J = 74

      #вначало
      @Home = 36

      #вконец
      @Home = 35

      #f5
      @f5 = 116

      #Скролим ли мы сейчас страницу
      @scrolling = false

      #Максимальное время скрола в мс.
      @max_scroll_time = 1500

      #За сколько милисекунд
      @scroll_time_step = 100

      #Скролим сколько пикселей
      @scroll_px_step = 1000

      #Для навешивания класса антиховера
      @html = document.querySelector 'html'

      @controlsPressed = []
      @controls = [8, 9, 45, 46, 39, 37, @esc, @ctrl, @alt, @shift, @enter, @cmd]
      @nextKeys = [@PgDown, @Down, @Right, @L, @J]
      @prevKeys = [@PgUp, @Up, @Left, @H, @K]

      @slides = document.getElementById 'slides'
      @articles = @slides.querySelectorAll 'article'
      @allSlidesCount = @articles.length
      @progress = document.querySelector '.progress .value'

      document.addEventListener 'dblclick', @fsState
      window.addEventListener 'resize', @resize
      
      document.addEventListener 'webkitfullscreenchange', @fsChange
      document.addEventListener 'mozfullscreenchange', @fsChange
      document.addEventListener 'msfullscreenchange', @fsChange
      document.addEventListener 'fullscreenchange', @fsChange
      document.addEventListener 'fullscreeneventchange', @fsChange

      document.addEventListener "keydown", @keyDown
      
      for slide in @articles
        slide.addEventListener "click", @selectSlide

      @pageSelector = document.querySelector '.go-to-page'
      @pageSelectorInput = @pageSelector.querySelector 'input'
      @pageSelector.addEventListener "submit", @selectPage

      page_number = parseInt(window.location.hash.replace("#slide-",""),10)-1
      if not isNaN(page_number) and page_number>-1 and page_number<@allSlidesCount
        @markCurrent @articles[page_number]
        if not window.document.body.classList.contains 'fs'
          @scrollToCurrent()
      
      @current = @getCurrentSlide()
      @resize()
      @redrawProgress()

    scrollToCurrent: (notime)=>
      @startTime = parseInt(new Date().getTime().toString().substr(-5),10)
      @startPos = window.pageYOffset
      @endPos = @current.offsetTop
      
      if notime == true
        window.scroll 0, @endPos
        return false

      @vector = 1
      @scrolling = true
      @html.classList.add 'scrolling'
      if @endPos<@startPos
        @vector = -1
      @toScroll = Math.abs(@endPos-@startPos)
      @duration = Math.round(@toScroll*@scroll_time_step/@scroll_px_step)
      if @duration > @max_scroll_time
        @duration = @max_scroll_time
      @scrollPerMS = @toScroll/@duration
      @endTime = @startTime+@duration
      @animationLoop()
    
    animationLoop: =>
      
      if not @renderScroll()
        @scrolling = false
        @html.classList.remove 'scrolling'
        return
      
      requestAnimationFrame @animationLoop


    renderScroll: =>

      time = parseInt(new Date().getTime().toString().substr(-5),10)
      if time>@endTime
        time = @endTime

      currentTime = time-@startTime

      window.scroll 0, Math.round((@vector*@scrollPerMS*currentTime)+@startPos)

      if @endTime<=time
        return false

      if window.pageYOffset==@endPos
        return false

      if window.document.body.classList.contains('fs')
        window.scroll 0, 0
        return false

      return true


    selectPage: (event)=>
      event.preventDefault()
      page = parseInt @pageSelectorInput.value, 10
      if isNaN(page)
        @pageSelectorInput.value = ""
      page--
      if page < 0
        page = 0
      if page>=@allSlidesCount
        page = @allSlidesCount-1

      @markCurrent @articles[page]
      @hidePageSelector()
      @pageSelectorInput.blur()
      @pageSelectorInput.value = ""
      if not window.document.body.classList.contains 'fs'
        @scrollToCurrent()

    hidePageSelector: (event)=>
      @pageSelector.classList.remove "open"

    togglePageSelector: (event)=>
      @pageSelector.classList.toggle "open"
      if @pageSelector.classList.contains "open"
        @pageSelectorInput.value = ""
        @pageSelectorInput.focus()
      else
        @pageSelectorInput.blur()
        @pageSelectorInput.value = ""


    selectSlide: (event)=>
      if not document.body.classList.contains 'fs'
        @markCurrent event.currentTarget


    redrawProgress: (event)=>
      before = @allSlidesCount - @slides.querySelectorAll('.current~article').length
      @progress.style.width = (before*100/@allSlidesCount).toFixed(2)+"%"


    keyUp: (event)=>

      index = @controlsPressed.indexOf event.which
      if index > -1  
        @controlsPressed.splice index, 1

    keyDown: (event)=>
      if event.which in @controls and @controlsPressed.indexOf(event.which)<0
        @controlsPressed.push event.which

      if event.which in @nextKeys
        @next()

      if event.which in @prevKeys
        @prev()

      switch event.which 
        
        when @P
          if not @scrolling == true
            @togglePageSelector()
          event.preventDefault()

        when @enter
          if not @pageSelector.classList.contains "open"
            window.document.body.classList.add 'fs'
            @fsStateOn()
            event.preventDefault()

        when @esc
          window.document.body.classList.remove 'fs'
          @fsStateOff()
          event.preventDefault()

    fsChange: =>

      fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement

      if fullscreenElement == null || fullscreenElement == undefined
        window.document.body.classList.remove 'fs'
        @scrollToCurrent()
      else
        window.document.body.classList.add 'fs'


    fsStateOff: =>
      if document.exitFullscreen
        document.exitFullscreen()
      else if document.msExitFullscreen
        document.msExitFullscreen()
      else if document.mozCancelFullScreen
        document.mozCancelFullScreen()
      else if document.webkitExitFullscreen
        document.webkitExitFullscreen()

    fsStateOn: =>
      if document.documentElement.requestFullscreen
        document.documentElement.requestFullscreen()
      else if document.documentElement.msRequestFullscreen
        document.documentElement.msRequestFullscreen()
      else if document.documentElement.mozRequestFullScreen
        document.documentElement.mozRequestFullScreen()
      else if document.documentElement.webkitRequestFullscreen
        document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)


    resize: =>
      fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement 
      if !((window.navigator.standalone || (fullscreenElement && fullscreenElement != null) || (document.mozFullScreen || document.webkitIsFullScreen) || (!window.screenTop && !window.screenY)))
        document.dispatchEvent(new CustomEvent('fullscreenchange', {bubbles: true, cancelable: true}))

      current = @getCurrentSlide()
      scale = 1/Math.max(current.clientWidth/window.innerWidth,current.clientHeight/window.innerHeight);

      [
        'WebkitTransform',
        'MozTransform',
        'msTransform',
        'OTransform',
        'transform'
      ].forEach (prop)=>
        @slides.style[prop] = 'scale(' + scale + ')'

    markCurrent: (element)=>
      old = @slides.querySelector '.current'
      if old != null && old != undefined
        old.classList.remove 'current'

      element.classList.add 'current'
      @current = element
      
      before = @allSlidesCount - @slides.querySelectorAll('.current~article').length
      @redrawProgress()
      
      history.pushState {}, "Слайд "+before, "index.html#slide-"+before

    getCurrentSlide: =>
      element = @slides.querySelector '.current'
      if element == null
        element = @slides.querySelector 'article'
      @markCurrent element
      return element

    next: =>
      element = @current.nextElementSibling
      if element == null
        element = @slides.querySelector 'article'
      @markCurrent element
      if not window.document.body.classList.contains 'fs'
        @scrollToCurrent()

    prev: =>
      element = @current.previousElementSibling
      if element == null
        element = @slides.querySelector 'article:last-child'
      @markCurrent element
      if not window.document.body.classList.contains 'fs'
        @scrollToCurrent()

  return slidsterController
