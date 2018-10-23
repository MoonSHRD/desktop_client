import React, { Component } from 'react';
require("jquery");
import './isNear.css';
import OwlCarousel from 'react-owl-carousel2';

// import 'react-owl-carousel2/src/owl.carousel.css';

class IsNear extends Component {


    render() {
        const options = {
            items: 1,
            nav: true,
            rewind: true,
            autoplay: true
        };

        // const events = {
        //     onDragged: function(event) {...},
        //     onChanged: function(event) {...}
        // };
        return (
            <div className="isNear">
                <OwlCarousel ref="car" options={options}  >
                    <div><img src="/img/fullimage1.jpg" alt="The Last of us"/></div>
                    <div><img src="/img/fullimage2.jpg" alt="GTA V"/></div>
                    <div><img src="/img/fullimage3.jpg" alt="Mirror Edge"/></div>
                </OwlCarousel>
            </div>

        );
    }
}

export default IsNear;
