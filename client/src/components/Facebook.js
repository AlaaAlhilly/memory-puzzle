import React, { Component } from "react";
import FacebookLogin from "react-facebook-login";
import MainContainer from './mainContainer';
import './fb_style.css'
export default class Facebook extends Component {
  state = {
    isLoggedIn: false,
    userID: "",
    name: "",
    email: "",
    picture: ""
  };

  responseFacebook = response => {
    console.log(response);

    this.setState({
      isLoggedIn: true,
      userID: response.userID,
      name: response.name,
      email: response.email,
      picture: response.picture.data.url
    });
  };

  componentClicked = () => console.log("clicked");

  render() {
    let fbContent;

    if (this.state.isLoggedIn) {
      fbContent = (
        <MainContainer name={this.state.name} picture={this.state.picture} userId={this.state.userID} email={this.state.email}/>
      );
    } else {
      fbContent = (
        <div className="container">
        <div className="row">
            <div className="col-sm-9 col-md-7 col-lg-12 mx-auto">
              <h1>Memory Puzzle Game</h1>
            <div className="card card-signin my-5">
              <div className="card-body">
                <h5 className="card-title text-center">Play and make friends</h5>
                <form className="form-signin text-center">
                  <FacebookLogin
                    appId="312791869433075"
                    autoLoad={true}
                    fields="name,email,picture"
                    onClick={this.componentClicked}
                    callback={this.responseFacebook}
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      );
    }
    return <div>{fbContent}</div>;
  }
}