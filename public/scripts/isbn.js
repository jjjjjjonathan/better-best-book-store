$(() => {
  console.log("ready");
  // getIsbn();
  $("#isbn-search").on('focusout', getIsbn);
});

const getIsbn = () => {
  let inputValue = $('#isbn-search').val();
  if (inputValue.length === 13 && Number.isInteger(parseInt(inputValue, 10))) {
    $.getJSON(`https://www.googleapis.com/books/v1/volumes?q=isbn:${inputValue}&key=AIzaSyDQnUnmSNC4nsjG1OUVulOWpUtLjn_2ARQ`)
      .then(data => {
        const bookInfo = data.items['0'].volumeInfo;
        $('#title-search').val(bookInfo.title);
      });
  } else {
    console.log('not isbn')
  }
};

// 9780593241431
