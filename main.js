const API_END_POINT = 'https://en.wikipedia.org/w/api.php'
const WIKIPEDIA_URL = 'https://en.wikipedia.org/wiki/'
const NO_IMAGE = 'images/no_image.jpg'
const wiki = $('.wiki')
const form = $('form')
const loader = $('.loader')
let searchBox = $('input[type="text"]')
let previousSearch
let wikiData = []

function createWikiEntry (entry) {
  let template = '<div class="wiki-entry">' +
    '<img src="imageSource">' +
    '<div><a href="wikipediaLink"><h3>title</h3></a>' +
    '<p>snippet</p></div>'

  template = template.replace('wikipediaLink', WIKIPEDIA_URL + entry.title)
  template = template.replace('imageSource', entry.imageSource || NO_IMAGE)
  template = template.replace('title', entry.title)
  template = template.replace('snippet', entry.snippet)
  return template
}

function updateUI (data) {
  let html = []
  data.forEach(function (item) {
    html.push(createWikiEntry(item))
  })
  wiki.html('<ul><li>' + html.join('</li><li>') + '</li></ul>')
    .hide()
    .slideDown(5000)
}

function updateEntryWithId (wikiEntries, id, imageSource) {
  let currentItem
  for (let i = 0; i < wikiEntries.length; i++) {
    currentItem = wikiEntries[i]
    if (currentItem.pageId === id) {
      currentItem.imageSource = imageSource
      return
    }
  }
}

function searchWikipediaForImages (titles) {
  $.ajax({
    url: API_END_POINT,
    dataType: 'json',
    data: {
      action: 'query',
      titles: titles.join('|'),
      prop: 'pageimages',
      pithumbsize: '250',
      format: 'json',
      origin: '*'
    },
    success: function (data) {
      let pages = data.query.pages
      for (let item in pages) {
        if ('thumbnail' in pages[item]) {
          updateEntryWithId(wikiData, Number(item), pages[item].thumbnail.source)
        }
      }
      updateUI(wikiData)
    },
    error: function (xhr, error, status) {
      console.error(error, status)
    },
    complete: function () {
      loader.hide()
    }
  })
}

function searchInWikipedia (searchTerm) {
  $.ajax({
    url: API_END_POINT,
    dataType: 'json',
    data: {
      action: 'query',
      list: 'search',
      srsearch: searchTerm,
      format: 'json',
      origin: '*'
    },
    beforeSend: function () {
      loader.show()
    },
    success: function (data) {
      let titles = []
      data.query.search.forEach(function (item) {
        wikiData.push({
          pageId: item.pageid,
          title: item.title,
          snippet: item.snippet
        })
        titles.push(item.title)
      })
      searchWikipediaForImages(titles)
    },
    error: function (xhr, error, status) {
      console.error(error, status)
    }
  })
}

form.submit(function (event) {
  event.preventDefault()
  let userInput = searchBox.val()
  if (userInput !== '' && userInput !== previousSearch) {
    searchBox.empty()
    wiki.empty()
    previousSearch = userInput
    wikiData = []
    searchInWikipedia(userInput)
  }
})
