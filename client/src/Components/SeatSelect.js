import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import SelectionError from './SelectionError';
import { doc, collection, updateDoc, addDoc } from "firebase/firestore"; 
import { db } from '../firebaseConfig';

export default function SeatSelect() {
  const location = useLocation();
  const movie = location.state?.movie;
  const selectedShowtime = location.state?.selectedShowtime;
  const navigate = useNavigate();

  const totalRows = 4; // A-D
  const totalColumns = 12; // 1-12
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [seatList, setSeatList] = useState(location.state?.selectedShowtime.seatList.slice())
  const [newTicketList, setNewTicketList] = useState([])

  const toggleSeatSelection = (seatId, seatNum) => {
    const isSelected = selectedSeats.includes(seatId);
    setSelectedSeats(isSelected ? selectedSeats.filter(id => id !== seatId) : [...selectedSeats, seatId]);
    var curr = seatList
    if(!isSelected){
      curr[seatNum] = "full"
      newTicketList.push(seatId)
    }
    else{
      curr[seatNum] = ""
      var index = newTicketList.indexOf(seatId)
      newTicketList.splice(index, 1)
    }
  
  };

  const handleNextClick = async () => {
    if (selectedSeats.length === 0) {
      setShowErrorDialog(true); // Show error dialog if no seats are selected
    } else {
      try {
        const docRef = doc(db, 'showtime', selectedShowtime.id)      
        await updateDoc(docRef, updatedShowtime)
      }catch (error) {
          console.log(error + "Error adding document");
        }
        try {
          await addDoc(collection(db, "ticket"), newTicket);
        }catch (error) {
            console.log(error + "Error adding document");
          }
      navigate('/select-tickets', { state: { movie, selectedShowtime, selectedSeats } });
    }
  };

  const updatedShowtime = {
    time: location.state?.selectedShowtime.time,
    room: location.state?.selectedShowtime.room,
    date: location.state?.selectedShowtime.date,
    movieid: location.state?.selectedShowtime.movieid,
    seatList: seatList,
  }

  const newTicket = {
    time: location.state?.selectedShowtime.time,
    room: location.state?.selectedShowtime.room,
    date: location.state?.selectedShowtime.date,
    movie: movie.name,
    seats: newTicketList,
  }

  return (
    <>
    <Navbar />
    <div className="flex items-center justify-center min-h-200 mt-6">
      <div className="w-full max-w-4xl p-8 space-y-8 bg-white shadow-lg rounded-xl">
        <div className="flex min-h-full flex-1 flex-col justify-center">
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Select Your Seats for {movie.name}
          </h2>
          <p className="text-center text-m text-gray-700 mt-2">
            {selectedShowtime.name}
          </p>
          <div className="mt-10">
            {Array.from({ length: totalRows }).map((_, rowIndex) => (
              <div key={rowIndex} className="flex justify-center mb-4">
                {Array.from({ length: totalColumns }).map((_, columnIndex) => {
              
                  const seatId = `${String.fromCharCode(65 + rowIndex)}${columnIndex + 1}`;
                  if(selectedShowtime.seatList[columnIndex + rowIndex*12] == ""){
                    return (
                      <button 
                        key={seatId} 
                        className={`w-16 h-16 bg-indigo-500 rounded-lg m-1 flex items-center justify-center ${selectedSeats.includes(seatId) ? 'bg-indigo-700' : ''}`} 
                        onClick={() => toggleSeatSelection(seatId, columnIndex + rowIndex*12)}
                      >
                        <span className="text-lg text-white font-semibold">
                          {seatId}
                        </span>
                      </button>
                    );
                  } 
                  else{
                    return (
                      <button 
                        key={seatId} 
                        className={`w-16 h-16 bg-gray-500 rounded-lg m-1 flex items-center justify-center`} 
                      >
                        <span className="text-lg text-white font-semibold">
                          {seatId}
                        </span>
                      </button>
                    );
                  }
                })}
              </div>
            ))}
            <div className="flex flex-row mt-16 space-x-4 justify-center">
                <button 
                    onClick={() => navigate(-1)}
                    className="px-20 py-2 text-sm font-semibold text-indigo-600 border border-indigo-600 rounded-md hover:text-indigo-400 hover:border-indigo-400"
                >
                Back to Showtimes
                </button>
                <button 
                    className="px-20 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-500"
                    onClick={() => handleNextClick(movie)}
                >
                Next
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    {showErrorDialog && <SelectionError open={showErrorDialog} setOpen={setShowErrorDialog} />}
    </>
  );
}