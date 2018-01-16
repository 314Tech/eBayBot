import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import '../styles/app.css';
import Message from './Message.js';

class Chatroom extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            chats: [{
                username: this.props.botChatName,
                content: <p>Hi! I am a Bot and you can ask me to find any product on eBay.</p>,
                img: this.props.bitImgURL
            }, {
                username: this.props.botChatName,
                content: <p>You can say "Find a laser saber" or "Search for a 1993 mustang"</p>,
                img: this.props.bitImgURL
            }]
        };
        this.submitMessage = this.submitMessage.bind(this);
    }

    componentDidMount() {
        this.scrollToBot();
    }

    componentDidUpdate() {
        this.scrollToBot();
    }

    scrollToBot() {
        ReactDOM.findDOMNode(this.refs.chats).scrollTop = ReactDOM.findDOMNode(this.refs.chats).scrollHeight;
    }

    formatStringForURLName(text) {
      // remove trailing and leading spaces
      if (text) {
        text = text.trim();
        // replace all spaces by %20
        text = text.replace(/ /g, '%20');
      }
      return text;
    }

    // URL for api.ai REST API
    apiaiURL(message) {
      const url = `https://api.dialogflow.com/v1/query?v=20150910&contexts=shop&lang=en&query=${this.formatStringForURLName(message)}&sessionId=12345&timezone=America/New_York`
      console.log(`URL: ${url}`);
      return url;
    }

    displayTypingBubbles() {
      this.setState({
        chats: this.state.chats.concat([{
          username: this.props.botChatName,
          content: <p>...</p>,
          img: this.props.bitImgURL
        }])
      });
      this.submitMessage = this.submitMessage.bind(this);
    }

    hideTypingBubbles() {
      this.setState({
        chats: this.state.chats.slice(0, -1)
      });
      this.submitMessage = this.submitMessage.bind(this);
    }

    // Callback when the bot responds
    receiveMessage(message) {
      this.setState({
        chats: this.state.chats.concat([{
          username: this.props.botChatName,
          content: <p>{message}</p>,
          img: this.props.bitImgURL
        }])
      });
      this.submitMessage = this.submitMessage.bind(this);
    }

    submitMessage(e) {
        e.preventDefault();

        const message = ReactDOM.findDOMNode(this.refs.msg).value;

        this.setState({
            chats: this.state.chats.concat([{
                username: "Me",
                content: <p>{message}</p>,
                img: this.props.bitImgURL
            }])
        }, () => {
            ReactDOM.findDOMNode(this.refs.msg).value = "";

            this.displayTypingBubbles();
            // api.ai REST API headers with app key
            var config = {
              headers: {'Authorization': 'Bearer 400630d5043446e39224f12965a01ecf'}
            };

            axios.get(this.apiaiURL(message), config)
            .then(response => {
              this.hideTypingBubbles();
              const speech = response.data.result.fulfillment.messages[0].speech;
              this.receiveMessage((speech) ? speech : 'Shoot. Something is wrong with Ebay\'s servers. I can\'t reach it');
            })
            .catch(error => {
              console.log(error);
              this.receiveMessage('I can\'t reach the API.AI server.')
            });
        });
    }

    render() {
        const username = "Me";
        const { chats } = this.state;

        return (
            <div className="chatroom">
                <h3>eBay Bot</h3>
                <ul className="chats" ref="chats">
                    {
                        chats.map((chat) =>
                            <Message chat={chat} user={username} />
                        )
                    }
                </ul>
                <form className="input" onSubmit={(e) => this.submitMessage(e)}>
                    <input type="text" ref="msg" />
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }
}

Chatroom.defaultProps = {
  botChatName: 'eBay Bot',
  bitImgURL: 'http://www.nabylbennouri.com/ebaybot/images/robot.png'
}

export default Chatroom;
