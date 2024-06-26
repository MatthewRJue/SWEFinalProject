import { Fragment, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import Navbar from './Navbar';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

function classNames(...classes) {
        return classes.filter(Boolean).join(' ');
}

export default function ShowtimeSelect() {
    const [showtimes, setShowtimes] = useState([]);
    const [selected, setSelected] = useState(null);
    const location = useLocation();
    const movie = location.state?.movie;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchShowtimes = async () => {
            try {
                const showtimesCollection = collection(db, 'showtime');
                const showtimesSnapshot = await getDocs(showtimesCollection);
                const showtimesData = showtimesSnapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter(showtime => showtime.movieid === movie.id); // Filter by movieId
                setShowtimes(showtimesData);
                console.log(showtimesData);  // Check what data is being fetched and stored
            } catch (error) {
                console.error('Error fetching showtimes: ', error);
            }
        };
        if (movie) {
            fetchShowtimes();
        }
    }, [movie]);

    const handleNextClick = () => {
        navigate('/select-seats', { state: { movie: movie, selectedShowtime: selected } });
    };

    return (
        <>
            <Navbar />
            <div className="flex flex-col items-center h-200">
                {movie && (
                    <div className="text-center mt-16">
                        <img src={movie.imageURL} alt={movie.name} className="w-60 h-auto mx-auto" />
                        <h2 className="mt-4 text-xl font-semibold">Select Showtime for {movie.name}</h2>
                    </div>
                )}
                <div className="flex items-center justify-center w-11/12">
                    <Listbox value={selected} onChange={setSelected}>
                        {({ open }) => (
                            <>
                                <div className="relative w-1/3 mx-auto mt-10">
                                    <Listbox.Button className="relative w-full h-12 cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                                        <span className="flex items-center">
                                            <span className="ml-3 block truncate">
                                                {selected ? `${selected.date}, ${selected.time}` : 'Select a Showtime'}
                                            </span>
                                        </span>
                                        <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                                            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                        </span>
                                    </Listbox.Button>
                                    <Transition
                                        show={open}
                                        as={Fragment}
                                        leave="transition ease-in duration-100"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                            {showtimes.map((showtime) => (
                                                <Listbox.Option
                                                    key={showtime.id}
                                                    className={({ active }) =>
                                                        classNames(
                                                            active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                                                            'relative cursor-default select-none py-2 pl-3 pr-9'
                                                        )
                                                    }
                                                    value={showtime}
                                                >
                                                    {({ selected, active }) => (
                                                        <>
                                                            <span className="block truncate">{showtime.date + ", " + showtime.time}</span>
                                                            {selected ? (
                                                                <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                                </span>
                                                            ) : null}
                                                        </>
                                                    )}
                                                </Listbox.Option>
                                            ))}
                                        </Listbox.Options>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Listbox>
                </div>
                <div className="flex flex-row mt-10 space-x-4">
                    <button 
                        onClick={() => navigate(-1)}
                        className="px-20 py-2 text-sm font-semibold text-indigo-600 border border-indigo-600 rounded-md hover:text-indigo-400 hover:border-indigo-400"
                    >
                    Cancel
                    </button>
                    <button 
                        className="px-20 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-500"
                        onClick={() => handleNextClick(movie)}
                    >
                     Next
                    </button>
                </div>
                <div>
                </div>
            </div>
        </>
    )
}