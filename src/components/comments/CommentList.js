import React from 'react';
    import Pusher from 'pusher-js';
    import CommentForm from './form';
    import Comment from './Comment';
    import '../../assets/css/comment.css';

    class Comments extends React.Component {
        constructor() {
          super();
          this.state = {
            comments: [],
          };
          this.pusher = new Pusher('09b96eb1ed61a9194ad8', {
            cluster: 'ap2',
          });
        }
        componentDidMount() {
          const channel = this.pusher.subscribe('post-comment');
          channel.bind('new-comment', (data) => {
            this.setState((prevState) => ({
              comments: [...prevState.comments, data],
            }));
          });
        }
  
        render() {
          const { comments } = this.state;
          return (
            <div>
              <CommentForm />
              <hr />
              <div className="comment-list">
                {comments.length ? (
                  comments.map((comment) => (
                    <Comment comment={comment} key={comment.id} />
                  ))
                ) : (
                  <h5 className="no-comments-alert">
                    No comments on this post yet.  Be the first
                  </h5>
                )}
              </div>
            </div>
          );
        }
      }
      export default Comments;