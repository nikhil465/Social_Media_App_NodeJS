{
  //method to submit the form data for new post using AJAX
  let createPost = function () {
    let newPostForm = $("#new-post-form");

    newPostForm.submit(function (e) {
      e.preventDefault();

      $.ajax({
        type: "post",
        url: "/posts/create",
        data: newPostForm.serialize(),
        success: function (data) {
          let newPost = newPostDom(data.data.post);
          $("#posts-list-container").prepend(newPost);
          deletePost($(" .delete-post", newPost));
          new ToggleLike($(" .toggle-like-button", newPost));
          new Noty({
            theme: "relax",
            text: "Post published!",
            type: "success",
            layout: "topRight",
            timeout: 1500,
          }).show();
          console.log(data);
        },
        error: function (err) {
          console.log(err.responseText);
        },
      });
    });
  };

  //method ot create post in DOM
  let newPostDom = function (post) {
    return $(`
            <div class="post" id = "post-${post._id}">
                
                    <a href="/posts/destroy/${post._id}" class="delete-post">Delete</a>
                
                <div class="user">${post.user.name}</div>
                <div class="content">${post.content}</div>
                <div class="post-likes"> 
                    <a href="/likes/toggle?id=${post._id}&type=Post" class="like-button"><i class="fas fa-thumbs-up"></i></a>
                    <span class="like-count">0 Likes</span>
                </div>
                
                    <form class="comment-form" action="/comments/create" method="POST">
                        <textarea class="comment-input" name="comment" placeholder="Write a comment" required></textarea>
                        <input type="hidden" name="post" value="${post._id}">
                        <button class="comment-submit" type="submit">Comment</button>
                    </form>
                
            
                
                    <div class="comments">
                        <p>Comments:</p>
                        
                    </div>
                
                
            </div>`);
  };

  //method to delete a post
  let deletePost = function (deleteLink) {
    $(deleteLink).click(function (e) {
      e.preventDefault();

      $.ajax({
        type: "get",
        url: $(deleteLink).prop("href"),
        success: function (data) {
          $(`#post-${data.data.post_id}`).remove();
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  };
  createPost();

  //   const likeButtons = document.querySelectorAll(".like-button");

  //   likeButtons.forEach((button) => {
  //     button.addEventListener("click", () => {
  //       button.classList.toggle("liked");
  //       const likeCount = button.nextElementSibling;
  //       const currentLikes = parseInt(likeCount.innerText);
  //       $.ajax({
  //         type: "post",
  //         url: $(" .like-button").prop("href"),
  //         success: function (data) {
  //           console.log("success data : ", data);
  //         },
  //         error: function (error) {
  //           console.log(error.responseText);
  //         },
  //       });

  //       if (button.classList.contains("liked")) {
  //         likeCount.innerText = `${currentLikes + 1} Likes`;
  //       } else {
  //         likeCount.innerText = `${currentLikes} Likes`;
  //       }
  //     });
  //   });
}
