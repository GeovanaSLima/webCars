import { Link } from "react-router-dom";
import { useCarContext } from "../../context/CarContext";
import { FiTrash2 } from "react-icons/fi";

export const CarGrid: React.FC = () => {
  const { cars, isLoading, loadedImages, deleteCar } = useCarContext();

  return (
    <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {isLoading
        ? Array(6)
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
          <section key={car.id} className="w-full bg-white rounded-lg hover:opacity-90 transition-all relative">
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

            {loadedImages[car.id] && (
              <>
                <button
                  onClick={ () => deleteCar(car, car?.userUid) }
                  className="absolute w-12 h-12 rounded-full bg-white drop-shadow flex justify-center items-center right-2 top-2 hover:bg-gray-100 transition-all"
                >
                  <FiTrash2 size={23} color="#000" />
                </button>
                <Link to={`/car/${car.id}`}>
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
                </Link>
              </>
            )}
          </section>
        ))}
    </main>
  );
};
