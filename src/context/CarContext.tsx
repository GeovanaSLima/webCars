import { createContext, useContext, useState, useCallback } from "react";
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { db, storage } from "../services/firebaseConnection";
import { deleteObject, ref } from "firebase/storage";
import toast from "react-hot-toast";

export interface CarProps {
  id: string;
  name: string;
  year: string;
  uid: string;
  price: string | number;
  city: string;
  km: string;
  images: CarImageProps[];
  owner?: string;
  model?: string;
  userUid?: string;
  whatsapp?: string;
  created?: string;
  description?: string;
}

export interface CarImageProps {
  name: string;
  uid: string;
  url: string;
}

interface CarContextProps {
  cars: CarProps[];
  isLoading: boolean;
  loadedImages: Record<string, boolean>;
  loadCars: () => Promise<void>;
  searchCars: (query: string) => Promise<void>;
  loadUserCars: (userUid: string | undefined) => Promise<void>;
  deleteCar: (car: CarProps, userUid: string | undefined) => Promise<void>;
}

const CarContext = createContext<CarContextProps | undefined>(undefined);

export const CarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cars, setCars] = useState<CarProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [hasLoaded, setHasLoaded] = useState(false);

  const loadCars = useCallback(async () => {
    if (hasLoaded) return; 
    setIsLoading(true);
    try {
      const carsRef = collection(db, "cars");
      const snapshot = await getDocs(carsRef);
      const carList: CarProps[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as CarProps[];

      setCars(carList);
      preloadImages(carList);
      setHasLoaded(true);
    } catch (error) {
      toast.error("Erro ao carregar carros.");
    } finally {
      setIsLoading(false);
    }
  }, [hasLoaded]); 

  const searchCars = async (queryRef: string) => {
    setIsLoading(true);
    try {
      const carsRef = collection(db, "cars");
      const q = queryRef.length
        ? query(carsRef, where("name", ">=", queryRef), where("name", "<=", queryRef + "\uf8ff"))
        : carsRef;

      const snapshot = await getDocs(q);
      const carList: CarProps[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as CarProps[];

      setCars(carList);
      preloadImages(carList);
    } catch (error) {
      toast.error("Erro ao buscar carros.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserCars = async (userUid: string | undefined) => {
    setIsLoading(true);
    try {
      const carsRef = collection(db, "cars");
      const q = query(carsRef, where("userUid", "==", userUid));
      const snapshot = await getDocs(q);
      const carList: CarProps[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as CarProps[];

      setCars(carList);
      preloadImages(carList);
    } catch (error) {
      toast.error("Erro ao carregar carros do usuário.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCar = async (car: CarProps, userUid: string | undefined) => {
    if (!confirm("Tem certeza que deseja excluir este carro?")) return;

    try {
      const docRef = doc(db, "cars", car.id);
      await deleteDoc(docRef);

      for (const image of car.images) {
        const imagePath = `images/${userUid}/${image.uid}`;
        const imageRef = ref(storage, imagePath);
        await deleteObject(imageRef);
      }

      setCars((prevCars) => prevCars.filter((c) => c.id !== car.id));
      toast.success("Carro excluído com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir o carro.");
    }
  };

  const preloadImages = (carList: CarProps[]) => {
    const initialLoadedImages = { ...loadedImages };

    carList.forEach((car) => {
      if (car.images.length > 0 && car.images[0]?.url) {
        const img = new Image();
        img.src = car.images[0].url;
        img.onload = () => {
          initialLoadedImages[car.id] = true;
          setLoadedImages({ ...initialLoadedImages });
        };
      }
    });
  };

  return (
    <CarContext.Provider
      value={{
        cars,
        isLoading,
        loadedImages,
        loadCars,
        searchCars,
        loadUserCars,
        deleteCar,
      }}
    >
      {children}
    </CarContext.Provider>
  );
};

export const useCarContext = (): CarContextProps => {
  const context = useContext(CarContext);
  if (!context) {
    throw new Error("useCarContext deve ser usado dentro de um CarProvider.");
  }
  return context;
};
