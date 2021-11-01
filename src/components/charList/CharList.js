import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './charList.scss';

import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import MarvelService from '../../services/MarvelService';

class CharList extends Component {
	state = {
		chars: [],
		loading: true,
		error: false,
		newItemLoading: false,
		offset: 210,
		charsEnd: false
	}

	marvelService = new MarvelService();

	itemRefs = [];

    setRef = (ref) => {
        this.itemRefs.push(ref);
    }

    focusOnItem = (id) => {
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();
    }

	componentDidMount() {
		this.onRequest();
	}

	onRequest = (offset) => {
		this.onCharsLoading();
		this.marvelService
		.getAllCharacters(offset)
		.then(this.onCharsLoaded)
		.catch(this.onError);
	}

	onCharsLoading = () => {
		this.setState({
			newItemLoading: true
		})
	}

	onCharsLoaded = (newChars) => {
		let charsEndTemp = false;
		if (newChars.length < 9) {
			charsEndTemp = true;
		}


		this.setState(({offset, chars}) => ({
			chars: [...chars, ...newChars],
			loading: false,
			newItemLoading: false,
			offset: offset + 9, 
			charsEnd: charsEndTemp
			}));
	}


	onError = () => {
		this.setState({error: true, loading: false});
	}

	renderItems = (arr) => {
		const items = arr.map ((item, i) => {
			let imgStyle = {"objectFit" : "cover"};
			if(item.thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg") {
				imgStyle = {"objectFit" : "unset"};
			} 

			return (
				<li className="char__item"
					tabIndex={0}
					ref={this.setRef}
					key={item.id}
					onClick={() => {
						this.props.onCharSelected(item.id);
						this.focusOnItem(i);
						}
					}
					onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            this.props.onCharSelected(item.id);
                            this.focusOnItem(i);
                        }
                    }}>
					<img src={item.thumbnail} alt={item.name} style={imgStyle}/>
					<div className="char__name">{item.name}</div>
				</li>
			);
		})

		return (
			<ul className="char__grid"> 
				{items}
			</ul>
		)
	}

	render() {
		const {chars, loading, error, offset, newItemLoading, charsEnd} = this.state;

		const items = this.renderItems(chars);

		const errorMessage = error ? <ErrorMessage/> : null;
		const spinner = loading ? <Spinner/> : null;
		const content = !(loading || error) ? items : null;

		return (
			<div className="char__list">
				{spinner}
				{errorMessage}
				{content}
				<button 
				className="button button__main button__long"
				style={{"display": charsEnd ? "none" : "block"}}
				disabled={newItemLoading}
				onClick={() => this.onRequest(offset)}>
					<div className="inner">load more</div>
				</button>
			</div>
		)
	}
}

CharList.propTypes = {
	onCharSelected: PropTypes.func.isRequired
}

export default CharList;