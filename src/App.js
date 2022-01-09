import { useEffect, useState } from 'react';
import styled from 'styled-components';
import search from './img/search.svg';
import download from './img/download.svg';

const accessKey = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`;

const baseLink = 'https://api.unsplash.com/photos/';

const searchLink = 'https://api.unsplash.com/search/photos';

function App() {
	// States
	const [photos, setPhotos] = useState([]);
	const [page, setPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState('');

	// Get Images Function
	const getImages = async () => {
		let url;
		const pageCount = `&page=${page}`;
		const query = `&query=${searchQuery}`;

		if (searchQuery) {
			url = `${searchLink}${accessKey}${pageCount}${query}`;
		} else {
			url = `${baseLink}${accessKey}${pageCount}`;
		}

		try {
			const res = await fetch(url);
			const data = await res.json().then((allPhotos) =>
				setPhotos((oldPhotos) => {
					if (searchQuery && page === 1) {
						return allPhotos.results;
					} else if (searchQuery) {
						return [...oldPhotos, ...allPhotos.results];
					} else {
						return [...oldPhotos, ...allPhotos];
					}
				})
			);
		} catch (error) {
			console.log(error);
		}
	};

	//Getting Images on refresh
	useEffect(() => {
		getImages();
	}, [page]);

	// Infinite Scroll
	useEffect(() => {
		const event = window.addEventListener('scroll', () => {
			if (
				window.innerHeight + window.scrollY >=
				document.body.scrollHeight - 5
			) {
				setPage((oldValue) => {
					return oldValue + 1;
				});
			}
		});

		return () => window.removeEventListener('scroll', event);
	}, []);

	// Handle search button submission
	const handleSubmit = (e) => {
		e.preventDefault();
		setPage(1);
		getImages();
	};

	// HTML
	const FormRender = () => {
		return (
			<form className='form'>
				<div className='input-control'>
					<input
						type='text'
						placeholder='Search for Items e.g Mountain...'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
					<button type='submit' onClick={handleSubmit}>
						Search <img src={search} alt='search icon' />
					</button>
				</div>
			</form>
		);
	};

	// Rendering Images
	const showPhotos = () => {
		return (
			<div className='content'>
				{photos.map((photo, idx) => (
					<div className='photo' key={idx}>
						<div className='image'>
							<img src={photo.urls.regular} alt='' />
						</div>
						<div className='details'>
							<p>{photo.user.name}</p>
							<a href={photo.urls.regular}>
								<img src={download} alt='Download' />
							</a>
						</div>
					</div>
				))}
			</div>
		);
	};

	return (
		<AppStyled>
			<header className='header'>
				<h2 className='logo'>Photo Booth</h2>
				{FormRender()}
			</header>
			<main className='main-content'>{showPhotos()}</main>
		</AppStyled>
	);
}

const AppStyled = styled.div`
	header {
		height: 30vh;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		background-color: #25354c;
		margin-bottom: 5rem;

		form {
			display: flex;
			justify-content: center;
			width: 50%;
			transition: all 0.4s ease-in-out;

			.input-control {
				position: relative;
				width: 70%;
				margin: 0 auto;
				text-align: center;
				transition: all 0.4s ease-in-out;
				input {
					padding: 0.6rem 2rem;
					background-color: #4f6877;
					outline: none;
					border: none;
					border-radius: 50px;
					filter: drop-shadow(0 4px 22px rgba(0, 0, 0, 0.25));
					width: 100%;
					color: #fff;
					font-family: inherit;
				}
				button {
					position: absolute;
					right: 5px;
					top: 50%;
					outline: none;
					border: none;
					transform: translateY(-50%);
					color: #fff;
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 0.3rem 1.5rem;
					background-color: rgba(107, 190, 146, 1);
					cursor: pointer;
					border-radius: 50px;
					img {
						padding-left: 1rem;
					}
				}
			}
		}
	}

	.content {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
		grid-gap: 2rem;
		grid-auto-rows: 1fr;
		width: 90%;
		margin: 0 auto;
		padding-bottom: 3rem;
		.photo {
			width: 100%;
			display: flex;
			flex-direction: column;
			padding: 1rem;
			background-color: #25354c;
			box-shadaow: 1px 8px 23px rgba(0, 0, 0, 0.25);
			.image {
				flex: 2;
				img {
					width: 100%;
					height: 100%;
					object-fit: cover;
				}
			}

			.details {
				color: #fff;
				display: flex;
				justify-content: space-between;
				padding-top: 1rem;
				img {
					width: 30px;
				}
			}
		}
	}
`;

export default App;
