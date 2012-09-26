root = exports ? this

rgb_to_hsl  = (r,g,b) ->
    [h,s,l] = [0,0,0]
    
    max = Math.max r, Math.max(g,b)
    min = Math.min r, Math.min(g,b)

    l = (max + min) / 2

    if (max is min)
        s = 0.0
        h = undefined;
    else
        if l <= 128
            s = 255 * (max - min) / (max + min)
        else 
            s = 255 * (max - min) / (511 - max - min)

        delta = max - min

        if delta is 0
            delta = 1

        if r is max
            h = (g - b) / delta
        else if g is max
            h = 2 + (b - r) / delta
        else
            h = 4 + (r - g) / delta

        h = h + 42.5

        if h < 0.0
            h += 255
        else if h > 255
            h -= 255

    [Math.round(h), Math.round(s), Math.round(l)]

hsl_value = (n1, n2, hue) ->
    if hue > 255
        hue -= 255
    else if hue < 0
        hue += 255

    if hue < 42.5
        value = n1 + (n2 - n1) * (hue / 42.5)
    else if hue < 127.5
        value = n2
    else if hue < 170
        value = n1 + (n2 - n1) * ((170 - hue) / 42.5)
    else
        value = n1

    Math.round (value * 255.0)



hsl_to_rgb = (h,s,l) ->
    [r,g,b] = [0,0,0]

    if s is 0
        r = l
        g = l
        b = l
    else
        if (l < 128)
            m2 = (l * (255 + s)) / 65025.0;
        else
            m2 = (l + s - (l * s) / 255.0) / 255.0;

        m1 = (l / 127.5) - m2

        h = hsl_value(m1, m2, h + 85)
        s = hsl_value(m1, m2, h)
        l = hsl_value(m1, m2, h - 85)
    
    [r,g,b]



color_balance = (val, l, sup, mup, dvs, dvm, dvh) ->
    value = val

    if l < sup
        f = (sup - l + 1)/(sup + 1)
        value += dvs * f
    else if l < mup
        mrange = (mup - sup)/2
        mid = mrange + sup
        diff = mid - l
        if (diff < 0) diff = -diff
        f = 1.0 - (diff + 1) / (mrange + 1)
        value += dvm * f
    else
        if = (l - mup + 1)/(255 - mup + 1)
        value += dvh * f
        
    value = Math.min(255,Math.max(0,value))



cb = (canvas_id, sup, mup, dvs, dvm, dvh) ->
    canvas = document.getElementById(canvas_id)
    ctx = canvas.getContext("2d")
    ctx.drawImage window.bob, 0, 0, canvas.width, canvas.height
    
    [dvsr, dvsg, dvsb] = [dvs.r, dvs.g, dvs.b]
    [dvmr, dvmg, dvmb] = [dvm.r, dvm.g, dvm.b]
    [dvhr, dvhg, dvhb] = [dvh.r, dvh.g, dvh.b]
    console.log "sup, mup, dvs, dvm, dvh "+ sup + "," + mup + "," +
    width = canvas.width
    console.log "width "+width
    height = canvas.height
    console.log "height "+height
    dataContainer = ctx.getImageData(0, 0, width, height)
    data = dataContainer.data
    dim = width * height * 4
    console.log "cb dim w*h*4 " + dim
    i = 0;
    while (i < dim)
        i1 = i+1
        i2 = i+2
        r = data[i]
        g = data[i1]
        b = data[i2]
        [h,s,l] = rgb_to_hsl(r,g,b)
        data[i] = color_balance(r, l, sup, mup, dvsr, dvmr, dvhr)
        data[i1] = color_balance(g, l, sup, mup, dvsg, dvmg, dvhg)
        data[i2] = color_balance(b, l, sup, mup, dvsb, dvmb, dvhb)
        if (i >= 144) and (i <= 288)
            console.log "i "+ i + " r,g,b " + r + "," + g + "," + b + " h,s,l " \
                + h + "," + s + "," + l + " data out " + data[i] + "," + data[i1] + "," + data[i2] \
                + " dvs " + JSON.stringify(dvs) + " dvm " + JSON.stringify(dvm) + " dvh " + JSON.stringify(dvh)
        i+=4
    ctx.putImageData dataContainer, 0, 0
    false

root.cb = cb
