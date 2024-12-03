import { useEffect, useState } from "react";
import { Container } from "../../components/container";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { Link } from "react-router-dom";

interface CarProps {
  id: string;
  name: string;
  year: string;
  uid: string;
  price: string | number;
  city: string;
  km: string;
  images: CarImageProps[];
}

interface CarImageProps {
  name: string;
  uid: string;
  url: string;
}

export default function Home() {
  const [cars, setCars] = useState<CarProps[]>([]);
  const [loadImages, setLoadImages] = useState<string[]>([]);

  useEffect(() => {

    function loadCars() {
      const carsRef = collection(db, "cars")
      const queryRef = query(carsRef, orderBy("created", "desc"))

      getDocs(queryRef)
      .then((snapshot) => {
        let listCars = [] as CarProps[];

        snapshot.forEach( doc => {
          listCars.push({
            id: doc.id,
            name: doc.data().name,
            year: doc.data().year,
            km: doc.data().km,
            city: doc.data().city,
            price: doc.data().price,
            images: doc.data().images,
            uid: doc.data().uid
          })
        })

        setCars(listCars);
      })

    }

    loadCars();
  }, [])

  function handleImageLoad(id: string) {
    setLoadImages((prevImageLoaded) => [...prevImageLoaded, id])
  }

  return (
    <Container>
      <section className="bg-white p-4 rounded-lg w-full max-w-3xl mx-auto flex justify-center items-center gap-2">
        <input 
          type="text" 
          placeholder="Digite o nome do carro..." 
          className="w-full border-2 rounded-lg h-9 px-3 outline-none"  
        />
        <button 
          className="bg-primary-500 hover:bg-primary-600 transition-all h-9 px-8 rounded-lg text-white font-medium text-lg shadow-md"
        >
          Buscar
        </button>
      </section>

      <h1 className="font-bold text-center mt-6 text-2xl mb-4"> 
        Carros novos e usados em todo o Brasil
      </h1>

      <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

        {cars.map( car => (
          <Link key={car.id} to={`/car/${car.id}`}>
            <section className="w-full bg-white rounded-lg hover:scale-105 transition-all">
              <img 
                className="w-full rounded-lg mb-2 max-h-72 object-cover"
                src={car.images[0].url}
                alt="Carro" 
                onLoad={ () => handleImageLoad(car.id) }
                style={{ display: loadImages.includes(car.id) ? "block" : "none" }}
              />
              
              <p className="font-bold mt-1 mb-2 px-4">{car.name}</p>

              <div className="flex flex-col px-4">
                <span className="text-zinc-700 mb-6">Ano {car.year} | {car.km}</span>
                <strong className="text-balance font-medium text-xl">R$ {car.price}</strong>
              </div>

              <div className="w-full h-px bg-slate-200 my-2"></div>

              <div className="px-4 pb-2">
                <span className="text-zinc-700">{car.city}</span>
              </div>

            </section>

          </Link>
        ))}

      </main>
    </Container>
  )
}
