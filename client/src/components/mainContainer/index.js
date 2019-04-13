import React, { Component } from 'react';
import Container from '../container';
import NavBar from '../navbar';
import './style.css'
import images from './images.json'
import StartButton from '../StartGame';
import LeftPannel from './LeftPanel';
import RightPannel from './RightPannel';
import swal from 'sweetalert';
import moment from 'moment';
import API from '../API';
import socketIOClient from 'socket.io-client';
var uniqid = require('uniqid');

class MainContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            score: 0,
            items: {},
            images: [],
            seconds: '00',
            value: '2',
            isClicked: false,
            highScores: [],
            image_mask: "https://i.imgur.com/ITxiG5s.jpg",
            endpoint: `https://memory-game-10.herokuapp.com/`,
            high_score :0
      
        }
        this.time_out = null;
        this.correct_counter = 0;
        this.indexes_guessed = [];
        this.sec_bonus = [];
        this.secondsRemaining = null;
        this.intervalHandle = null;
        this.handleChange = this.handleChange.bind(this);
        this.startCountDown = this.startCountDown.bind(this);
        this.timing = this.timing.bind(this);
    }
    componentDidMount() {
        const  endpoint  = this.state.endpoint;
        const socket = socketIOClient(endpoint);
        socket.on("FromAPI", data => {
            this.setState({
                highScores: data,
            })
        });
   
    }
    re_sort_images = t_images => {
        let len = t_images.length;
        let tempArr = [];
        for ( let i = 0; i < len-1; i++ ) {
            tempArr.push(t_images.splice(Math.floor(Math.random()*t_images.length),1)[0]);
        }
        tempArr.push(t_images[0]);
        t_images = tempArr;
        return t_images;
    }
    //click logic and supporting functions
    handleClickEvent = (name, index) => {
        //check if the image is already clicked before
        if (this.indexes_guessed.includes(index) || this.indexes_guessed.length >= 2) {
            return;
        }
        //get the time for the clicks
        this.sec_bonus.push(moment())
        //get all imaged that clicked indexes
        this.indexes_guessed.push(index)
        //get all the object we have saved
        let items = this.get_saved_images_that_clicked();
        if (Object.keys(this.state.items).length === 0) {
            items[name] = 1;
            this.update_with_first_guess(index, name, items);
            return;
        }
        //check if it is the correct guess
        if (this.state.items[name]) {
            this.update_the_state_correct_guess(index);
        } else {
            //reset the seconds bonus
            this.sec_bonus = [];
            this.update_the_state_incorrect_guess(index)
        }
    }
    expose_image = (index) => {
        let temp_images = this.get_copy_of_saved_images();
        temp_images[index].src = temp_images[index].src2;
        return temp_images;
    }
    update_with_first_guess = (index, name, items) => {
        items[name] = 1;
        let temp_images = this.expose_image(index);
        this.setState({
            images: Array.from(temp_images),
            items: items,
        })
    }
    update_the_state_incorrect_guess = (index) => {
        let temp_images = this.expose_image(index);
        this.setState({
            images: Array.from(temp_images)
        })
        setTimeout(() => {
            this.hide_exposed_images();
        },1000)
    }
    hide_exposed_images = () => {
        let temp_images = this.get_copy_of_saved_images();
        for (let i = 0; i < this.indexes_guessed.length; i++){
            temp_images[this.indexes_guessed[i]].src = this.state.image_mask;
            temp_images[this.indexes_guessed[i]].disabled = "false";
        }
        this.indexes_guessed = [];
        this.setState({
            images: Array.from(temp_images),
            items: {},
        })
    }
    get_fast_guess_bunos = () => {
        let bonus = 0;
        let calc_bonus_sec = parseInt(this.state.value) * 60 + parseInt(this.state.seconds);
        let ms = moment(this.sec_bonus[1],"DD/MM/YYYY HH:mm:ss").diff(moment(this.sec_bonus[0],"DD/MM/YYYY HH:mm:ss"));
        let d = moment.duration(ms);
        if (d.seconds() <= calc_bonus_sec / (images.length - this.correct_counter)) {
            bonus = d.seconds() / (calc_bonus_sec/ (images.length - this.correct_counter));
            bonus = 100 - parseInt(10 * bonus);
        }
        if (this.correct_counter == images.length - 2) {
            this.win_the_game()
        } else {
            this.correct_counter += 2;
        }
        this.sec_bonus= []
        return bonus;
    }
    update_the_state_correct_guess = (index) => {
        let bonus = this.get_fast_guess_bunos()
        let image_ex = this.expose_image(index);
        this.setState({images:image_ex})
        let images_copy = this.disable_correct_guessed_images();
        this.indexes_guessed = [];
        this.setState({
            score: this.state.score +10 + bonus,
            items: {},
            images: images_copy,
        });
    }
    get_copy_of_saved_images = () => {
        let temp_images = Array.from(this.state.images);
        return temp_images;
    }
    disable_correct_guessed_images = () => {
        let temp_images = this.get_copy_of_saved_images()
        for (let i = 0; i < this.indexes_guessed.length; i++){
            temp_images[this.indexes_guessed[i]].disabled = "true";
            temp_images[this.indexes_guessed[i]].className = "guessed";
        }
        return temp_images
    }
    get_saved_images_that_clicked = () => {
        let items = {};
        const res_items = Object.assign(items, this.state.items);
        return res_items;
    }
    //------------end of click event functions
    reset_the_images_states = () => {
        images.forEach(image => {
            image.src = this.state.image_mask;
            image.disabled = "false";
            image.className = "";
        })
    }
    activate_half_time_bonus = () => {
        let bk_this = this;
        this.time_out = setTimeout(() => { 
            if (bk_this.correct_counter >= images.length / 2) {
                bk_this.setState({ score: bk_this.state.score + (bk_this.correct_counter * 5) }) 
            }
            console.log(bk_this.state.score+" "+bk_this.correct_counter);
        }, 60000)
    }
    get_this_user_highest_score = () => {
        console.log(this.props)
        API.highestScore(this.props.email)
            .then(res => {
                if(res.data)
                    this.setState({ high_score: res.data.high_score })
            })
            .catch(err => console.log(err));
    }
    save_this_score = () => {
        let score_to_save = {
            email: this.props.email,
            name: this.props.name,
            picture: this.props.picture,
            high_score: this.state.score
        }
        API.saveScore(score_to_save)
            .then(res => {
                this.get_this_user_highest_score();
            })
        }
    startTheGame = () => {
        this.get_this_user_highest_score()
        this.reset_the_images_states()
        this.setState({
            value: '2',
            seconds: '00',
            items: {},
            images: this.re_sort_images(Array.from(images))
        })
        this.activate_half_time_bonus();
        this.startCountDown()
    }
    gameOver = () => {
        swal("times up", {
            buttons: {
                cancel: true,
                confirm: true,
            },
            closeOnClickOutside: false
        }).then(con=>{
            if (con) {
                this.save_this_score();
                this.indexes_guessed = [];
                this.correct_counter = 0;
                this.sec_bonus = [];
                if (con) this.startTheGame()
            } else {
            window.location.reload();
        }
    })
    }
    win_the_game = () => {
        swal("Congrats you won the game", {
            buttons: {
                cancel: true,
                confirm: true,
            },
            closeOnClickOutside: false
        }).then(con=>{
            if (con) {
                this.save_this_score();
                this.indexes_guessed = [];
                this.correct_counter = 0;
                this.sec_bonus = [];
                if (con) this.startTheGame()
            } else {
                window.location.reload();
            }
        })
    }
      //timer process
      handleChange(event) {
        this.setState({
          value: event.target.value
        })
      }
    
    timing() {
        var min = Math.floor(this.secondsRemaining / 60);
        var sec = this.secondsRemaining - (min * 60);
    
        this.setState({
          value: min,
          seconds: sec,
        })
        if (sec < 10) {
          this.setState({
            seconds: "0" + this.state.seconds,
          })
    
        }
        if (min < 10) {
          this.setState({
            value: "0" + min,
          })
    
        }
        if (min === 0 && sec === 0) {
            clearInterval(this.intervalHandle);
            console.log(min + " " + sec);
            this.gameOver()
        }
        this.secondsRemaining--
    }
    startCountDown() {
        this.intervalHandle = setInterval(this.timing, 1000);
        let time = this.state.value;
        this.secondsRemaining = time * 60;
        this.setState({
          isClicked : true
        })
      }
    //end of timer
    fill_divs_with_images = () => {
        let images = [];
        this.state.images.forEach((image, index) => {
                images.push(
                    <Container
                        className={image.className}
                        disabled = {image.disabled}
                        index={index}
                        src={image.src}
                        name={image.name}
                        key={uniqid()}
                        handleClickEvent={this.handleClickEvent}
                     />
                )
        })
        return images;
    }
    render() {
        const isClicked = this.state.isClicked
        if (!isClicked) {
            return (
                <div className="container" style={{paddingLeft:"0"}}>
                    <StartButton startTheGame={this.startTheGame}/>
                </div>
            )
        } else {
            let images = this.fill_divs_with_images();
            return (
                <div>
                    <NavBar
                        value={this.state.value}
                        seconds={this.state.seconds}
                    />
                    <main className="container-fluid" style={{marginTop:"20px"}}>
                        <div className="row">
                            <LeftPannel
                                picture={this.props.picture}
                                name={this.props.name}
                                score={this.state.score}
                                highest_score={this.state.high_score}
                            />
                            <div className="col-sm-8 col-md-8 col-lg-7">
                                {
                                    images
                                }
                            </div>
                            <RightPannel high_scores={this.state.highScores}/>
                       </div>
                    </main>
                </div>
            )
        }
        
    }
}
export default MainContainer;