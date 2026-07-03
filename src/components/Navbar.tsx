import { Link, useLocation } from '@tanstack/react-location';
import React, { useEffect, useState } from 'react';
import { useSearch } from '../context/searchContext';
import Bookmarks from '../icons/Bookmarks';
import Clear from '../icons/Clear';
import Filter from '../icons/Filter';
import House from '../icons/House';
import Left from '../icons/Left';
import Search from '../icons/Search';
import FilterModal from './FilterModal';

export default function Navbar(): React.ReactElement {
	const location = useLocation();
	const [from, setFrom] = useState<'home' | 'list'>();
	const { search, setSearch, filter, setFilter } = useSearch();
	const [lastListView, setLastListView] = useState<string>();
	const [filterOpen, setFilterOpen] = useState<boolean>(false);

	useEffect(() => {
		const { pathname } = location.current;

		if (pathname.match(/^\/s\/\d+/)) {
			switch (location.current.search.from) {
				case 'home':
					setFrom('home');
					location.navigate({ ...location.current, search: {}, searchStr: '' }, true);
					break;
				case 'list':
					setFrom('list');
					location.navigate({ ...location.current, search: {}, searchStr: '' }, true);
					break;
				default: {
					setFrom(undefined);
				}
			}
		} else {
			setFrom(undefined);
		}

		if (pathname !== lastListView && (pathname === '/' || pathname.match(/^\/l\/.+/))) {
			setLastListView(pathname);
			if (lastListView) setSearch('');
			window.scrollTo(0, 0);
		}
	}, [location.current.pathname]);

	useEffect(() => {
		if (location.current.pathname === lastListView) return;
		if (!lastListView && (!search || !filter.length)) return;

		if (from === 'list') return location.history.back();
		location.history.push(lastListView || '/');
	}, [search, filter]);

	return (
		<>
			<nav className="navbar">
				<div className="menu">
					<div className="flex-row items-center">
						<Link to="/" disabled={location.current.pathname === '/' || from === 'home'}>
							<button
								aria-label="Home"
								onClick={from === 'home' ? location.history.back : undefined}
							>
								<House />
							</button>
						</Link>

						{from === 'list' && (
							<button aria-label="Go back" onClick={location.history.back}>
								<Left />
							</button>
						)}
						<h1>Sågarstugan</h1>
					</div>
					<div className="flex-row">
						<button aria-label="Filter songs" onClick={() => setFilterOpen(true)}>
							<Filter />
						</button>
						<Link to="/bookmarks">
							<button aria-label="Bookmarks">
								<Bookmarks />
							</button>
						</Link>
					</div>
				</div>
				<div className="search">
					<div className="search-field">
						<button
							aria-label="Search"
							onClick={() => document.getElementById('searchbar')?.focus()}
						>
							<Search size="sm" />
						</button>
						<input
							id="searchbar"
							aria-label="Search for title or text"
							value={search}
							onChange={(e) => setSearch(e.currentTarget.value)}
							placeholder="Search for title or text"
						/>
						{!!search && (
							<button
								aria-label="Clear search"
								onClick={() => {
									setSearch('');
									document.getElementById('searchbar')?.focus();
								}}
							>
								<Clear size="sm" />
							</button>
						)}
					</div>
				</div>
			</nav>
			<FilterModal
				isOpen={filterOpen}
				onClose={() => setFilterOpen(false)}
				onConfirm={setFilter}
				startValue={filter}
			/>
		</>
	);
}
