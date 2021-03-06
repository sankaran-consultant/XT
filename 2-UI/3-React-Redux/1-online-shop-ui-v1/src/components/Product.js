import React, { Component } from 'react';
import classNames from 'classnames'
import Review from './Review';
import ReviewForm from './ReviewForm_v2';

import store from '../store'
import { loadReviews, addNewReview } from '../actions/reviews'
import { buy } from '../actions/cart'

class Product extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentTab: 1,
            reviews: []
        }
    }
    componentDidMount() {
        let { item } = this.props;
        this.unsubscribe = store.subscribe(() => {
            let reviews = store.getState().reviews[item.id] || [];
            this.setState({ reviews })
        })
    } 
    componentWillUnmount() {
        this.unsubscribe();
    }

    changeTab(tabIndex) {
        this.setState({ currentTab: tabIndex }, () => {
            if (tabIndex === 3) {
                let { item } = this.props;
                let action = loadReviews(item.id)
                store.dispatch(action);
            }
        })
    }
    handleBuy() {
        let { item } = this.props;
        let qty = this.refs.qty.value
        let action = buy(item, qty)
        store.dispatch(action);
    }
    renderBuyBtn(product) {
        if (product.canBuy)
            return (
                <div>
                    <button onClick={e => this.handleBuy()} className="btn btn-sm btn-primary">buy</button>
                    &nbsp;
                    <input min="2" max="3" type="number" ref="qty" />
                </div>
            )
        else return null;
    }
    renderReviews() {
        let { reviews } = this.state;
        return reviews.map((item, idx) => {
            return <Review key={idx} item={item} />
        });
    }
    addNewReview(review) {
        let { item } = this.props;
        let action = addNewReview(item.id, review)
        store.dispatch(action);
    }
    renderTabPanel(item) {
        let { currentTab } = this.state;
        let panel;
        switch (currentTab) {
            case 1: {
                panel = (<div>{item.description}</div>)
                break;
            }
            case 2: {
                panel = (<div>Not Yet</div>)
                break;
            }
            case 3: {
                panel = (
                    <div>
                        {this.renderReviews()}
                        <ReviewForm onNewReview={review => this.addNewReview(review)} />
                    </div>)
                break;
            }
            default: panel = null;
        }
        return panel;
    }
    render() {
        let { item } = this.props;
        let { currentTab } = this.state;
        return (
            <div>
                <div className="row">
                    <div className="col-3 col-sm-3 col-md-3">
                        <img src={"/" + item.image} className="img-fluid" alt={item.name} />
                    </div>
                    <div className="col-9 col-sm-9 col-md-9">
                        <h5>{item.name}</h5>
                        <h6>&#8377;{item.price}</h6>
                        {this.renderBuyBtn(item)}
                        <ul className="nav nav-tabs">
                            <li className="nav-item">
                                <a onClick={e => this.changeTab(1)} className={classNames('nav-link', { active: currentTab === 1 })} href="#/">Description</a>
                            </li>
                            <li className="nav-item">
                                <a onClick={e => this.changeTab(2)} className={classNames('nav-link', { active: currentTab === 2 })} href="#/">Specifcation</a>
                            </li>
                            <li className="nav-item">
                                <a onClick={e => this.changeTab(3)} className={classNames('nav-link', { active: currentTab === 3 })} href="#/">Reviews</a>
                            </li>
                        </ul>
                        {this.renderTabPanel(item)}
                    </div>
                </div>
            </div>
        );
    }
}

export default Product;