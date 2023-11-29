'use strcit'

'use strcit'

function renderGallery() {
    var elGalary = document.querySelector('.galary')
    var strHtml
    var imgesUrl = getImges()
    console.log(imgesUrl)

    strHtml = imgesUrl.map(url => `<img src="${url}" alt="">`).join('')

    console.log(strHtml)
}