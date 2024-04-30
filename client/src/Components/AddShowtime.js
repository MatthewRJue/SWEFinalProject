import {useState} from "react"
import { doc, collection, addDoc } from "firebase/firestore"; 
import { db } from '../firebaseConfig';

const AddShowtime = ({isOpen, onClose, movieList, showtimeList}) => {

    const [movie, setMovie] = useState("");
    const [room, setRoom] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [movieid, setID] = useState("")
  
    const handleSubmit = async (event) => {
        event.preventDefault();

        if(newShowtime.movieid != "" && newShowtime.date != "" && newShowtime.time != "" && newShowtime.room != ""){
            try {
                await addDoc(collection(db, "showtime"), { ...newShowtime });
                window.location.reload(); // Refresh the page
                } catch (error) {
                  console.log(error + "Error adding document");
                }
            onClose()
        } 
    }

    const handleNameToID = (checkMovie) => {
        setMovie(checkMovie)
        for(var j = 0; j < movieList.length; j++){
            if(movieList[j].name === checkMovie){
                setID(movieList[j].id)
            }
        }
    }

    const movieNameList = []
    console.log(movieList)
    for(var i = 0; i < movieList.length; i++){
        movieNameList.push(movieList[i].name)
    }
    const roomList = ["A1", "A2", "A3", "A4", "A5", "B1", "B2", "B3", "B4", "B5"]
   
    if (!isOpen) return null;

    const newShowtime = {
        movieid,
        room,
        date,
        time,
    }
   
    
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full flex justify-center items-center" onClick={onClose}>
        <div className="relative top-52 bottom-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-center h-screen">
          <label>
            Movie:
            <select value={movie} onChange={e => handleNameToID(e.target.value)}>
              {movieNameList.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>

          <label>
            Theater Room:
            <select value={room} onChange={e => setRoom(e.target.value)}>
              {roomList.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>

          <label>
            Select Date:
            <input type="date" value={date} onChange={e => setDate(e.target.value)} />
          </label>
          <label>
            Select Time:
            <input type="time" value={time} onChange={e => setTime(e.target.value)} />
          </label>
          </div>
          <div className="flex flex-row mt-10 space-x-4 justify-center">
                <button 
                  className="px-20 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-500"
                >
                Add Movie
                </button>
            </div>
        </form>
      </div>
    </div>
    );
}

export default AddShowtime