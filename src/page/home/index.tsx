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
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCars() {
      const carsRef = collection(db, "cars");
      const queryRef = query(carsRef, orderBy("created", "desc"));

      try {
        const snapshot = await getDocs(queryRef);
        const listCars: CarProps[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          year: doc.data().year,
          km: doc.data().km,
          city: doc.data().city,
          price: doc.data().price,
          images: doc.data().images,
          uid: doc.data().uid,
        }));

        setCars(listCars);
        setIsLoading(false);

        // Pré-carregamento das imagens
        const initialLoadedImages = { ...loadedImages };
        listCars.forEach((car) => {
          if (car.images.length > 0 && car.images[0]?.url) {
            const img = new Image();
            img.src = car.images[0].url;
            img.onload = () => {
              initialLoadedImages[car.id] = true;
              setLoadedImages({ ...initialLoadedImages });
            };
          }
        });
      } catch (error) {
        console.error("Erro ao carregar os carros:", error);
        setIsLoading(false); // Encerra o carregamento mesmo em caso de erro
      }
    }

    loadCars();
  }, []);

  return (
    <Container>
      <section className="bg-white p-4 rounded-lg w-full max-w-3xl mx-auto flex justify-center items-center gap-2">
        <input
          type="text"
          placeholder="Digite o nome do carro..."
          className="w-full border-2 rounded-lg h-9 px-3 outline-none"
        />
        <button className="bg-primary-500 hover:bg-primary-600 transition-all h-9 px-8 rounded-lg text-white font-medium text-lg shadow-md">
          Buscar
        </button>
      </section>

      <h1 className="font-bold text-center mt-6 text-2xl mb-4">
        Carros novos e usados em todo o Brasil
      </h1>

      <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Mostrar placeholders enquanto os dados estão carregando */}
        {isLoading
          ? Array(6) // Exibir 6 placeholders como exemplo
              .fill(null)
              .map((_, index) => (
                <section
                  key={index}
                  className="w-full bg-white rounded-lg animate-pulse"
                >
                  <div className="w-full h-72 rounded-lg bg-slate-200"></div>
                  <div className="w-3/4 h-6 mt-4 mb-2 bg-slate-200 rounded-md mx-4"></div>
                  <div className="flex flex-col px-4">
                    <div className="w-1/2 h-4 bg-slate-200 rounded-md mb-6"></div>
                    <div className="w-1/3 h-5 bg-slate-200 rounded-md"></div>
                  </div>
                  <div className="w-full h-px bg-slate-200 my-2"></div>
                  <div className="pb-4">
                    <div className="w-1/2 h-4 bg-slate-200 rounded-md mx-4"></div>
                  </div>
                </section>
              ))
          : cars.map((car) => (
              <Link key={car.id} to={`/car/${car.id}`}>
                <section className="w-full bg-white rounded-lg hover:scale-105 transition-all">
                  {/* Placeholder completo enquanto a imagem é carregada */}
                  {!loadedImages[car.id] && (
                    <div className="animate-pulse">
                      <div className="w-full h-72 rounded-lg bg-slate-200"></div>
                      <div className="w-3/4 h-6 mt-4 mb-2 bg-slate-200 rounded-md mx-4"></div>
                      <div className="flex flex-col px-4">
                        <div className="w-1/2 h-4 bg-slate-200 rounded-md mb-6"></div>
                        <div className="w-1/3 h-5 bg-slate-200 rounded-md"></div>
                      </div>
                      <div className="w-full h-px bg-slate-200 my-2"></div>
                      <div className="pb-4">
                        <div className="w-1/2 h-4 bg-slate-200 rounded-md mx-4"></div>
                      </div>
                    </div>
                  )}

                  {/* Exibição final dos dados */}
                  {loadedImages[car.id] && (
                    <>
                      <img
                        className="w-full rounded-lg mb-2 max-h-72 object-cover"
                        src={car.images[0]?.url}
                        alt="Carro"
                      />
                      <p className="font-bold mt-1 mb-2 px-4">{car.name}</p>
                      <div className="flex flex-col px-4">
                        <span className="text-zinc-700 mb-6">
                          Ano {car.year} | {car.km}
                        </span>
                        <strong className="text-balance font-medium text-xl">
                          R$ {car.price}
                        </strong>
                      </div>
                      <div className="w-full h-px bg-slate-200 my-2"></div>
                      <div className="px-4 pb-2">
                        <span className="text-zinc-700">{car.city}</span>
                      </div>
                    </>
                  )}
                </section>
              </Link>
            ))}
      </main>
    </Container>
  );
}
