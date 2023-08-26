// CHANGE :: create a class to toggle likes when a link is clicked, using AJAX
class ToggleLike {
  constructor(toggleElement) {
    this.toggler = toggleElement;
    this.toggleLike();
  }

  toggleLike() {
    $(this.toggler).click(function (e) {
      e.preventDefault();
      let self = this;
      console.log($(self));
      // this is a new way of writing ajax which you might've studied, it looks like the same as promises
      $.ajax({
        type: "POST",
        url: $(self)[0].children[0].href,
      })
        .done(function (data) {
          let likesCount = parseInt(
            $(self)[0].children[1].innerText.split(" ")[0]
          );
          console.log(likesCount);
          if (data.data.deleted == true) {
            likesCount -= 1;
          } else {
            likesCount += 1;
          }

          $(self)[0].children[1].innerHTML = `${likesCount} Likes`;
          //$(self).html(`${likesCount} Likes`);
        })
        .fail(function (errData) {
          console.log("error in completing the request");
        });
    });
  }
}
