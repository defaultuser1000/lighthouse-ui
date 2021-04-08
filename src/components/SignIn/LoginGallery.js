import React from 'react';
import AliceCarousel from "react-alice-carousel";
import image1 from '../../assets/images/login_gallery/R1-09216-0009.jpg';
import image2 from '../../assets/images/login_gallery/R1-09217-0000.jpg';
import image3 from '../../assets/images/login_gallery/R1-09217-0010.jpg';
import image4 from '../../assets/images/login_gallery/R1-09217-0014.jpg';
import image5 from '../../assets/images/login_gallery/R1-09217-0025.jpg';
import image6 from '../../assets/images/login_gallery/R1-09217-0027.jpg';
import image7 from '../../assets/images/login_gallery/R1-09217-0028.jpg';
import image8 from '../../assets/images/login_gallery/R1-09217-0030.jpg';
import image9 from '../../assets/images/login_gallery/R1-09218-0010.jpg';
import image10 from '../../assets/images/login_gallery/R1-09218-0014.jpg';
import './LoginGallery.scss';
import "react-alice-carousel/lib/scss/alice-carousel.scss";

export default class LoginGallery extends React.Component {

    handleDragStart = (e) => e.preventDefault();

    items = [
        <img src={image1} onDragStart={this.handleDragStart} className="sliderimg" alt=""/>,
        <img src={image2} onDragStart={this.handleDragStart} className="sliderimg" alt=""/>,
        <img src={image3} onDragStart={this.handleDragStart} className="sliderimg" alt=""/>,
        <img src={image4} onDragStart={this.handleDragStart} className="sliderimg" alt=""/>,
        <img src={image5} onDragStart={this.handleDragStart} className="sliderimg" alt=""/>,
        <img src={image6} onDragStart={this.handleDragStart} className="sliderimg" alt=""/>,
        <img src={image7} onDragStart={this.handleDragStart} className="sliderimg" alt=""/>,
        <img src={image8} onDragStart={this.handleDragStart} className="sliderimg" alt=""/>,
        <img src={image9} onDragStart={this.handleDragStart} className="sliderimg" alt=""/>,
        <img src={image10} onDragStart={this.handleDragStart} className="sliderimg" alt=""/>
    ];

    render() {
        return (
            <AliceCarousel autoPlay
                           infinite
                           disableButtonsControls
                           animationType={'fadeout'}
                           animationDuration={1200}
                           autoPlayInterval={8000}
                           items={this.items}
            />
        );
    }

}