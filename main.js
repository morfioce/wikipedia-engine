$.ajax({
  url: 'https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=Albert%20Einstein&format=json',
  crossDomain: true,
  success: function (data) {
    console.log(data)
  },
  error: function (xhr, error) {
  	console.error(error)
  }
})
