import { FiImage, FiTrash } from "react-icons/fi";
import { Container } from "../../../components/container";
import { DashHeader } from "../../../components/dashHeader";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../../components/input";
import { ChangeEvent, useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { v4 as uuidV4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../../services/firebaseConnection";
import { addDoc, collection } from "firebase/firestore";
import { toast } from "react-toastify";

const schema = z.object({
  name: z.string().min(1, "O campo nome é obrigatório"),
  model: z.string().min(1, "O modelo é obrigatório"),
  year: z.string().min(1, "O ano do carro é obrigatório"),
  km: z.string().min(1, "O KM do carro é obrigatório"),
  price: z.string().min(1, "O valor do carro é obrigatório"),
  city: z.string().min(1, "O campo cidade é obrigatório"),
  whatsapp: z.string().min(1, "O telefone é obrigatório").refine((value) => /^(\d{11,12})$/.test(value), {
    message: "Número de telefone inválido"
  }),
  description: z.string().min(1, "A descrição do carro é obrigatória")
})

type FormData = z.infer<typeof schema>;

interface ImageProps {
  uid: string | null;
  name: string;
  previewUrl: string;
  url: string | null;
  file: File;
}

export default function New() {
  const { user } = useContext(AuthContext);

  const [images, setImages] = useState<ImageProps[]>([]);

  const { register, handleSubmit, reset, formState: { errors }} = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange"
  })

  async function onSubmit(data: FormData) {
    
    if (!images) {
      alert("Por favor adicione a imagem do veículo")
      return;
    }  

    
    const uploadedImages = await handleImageUpload(images);

    const carImages = uploadedImages.map((car) => ({
      uid: car.uid,
      name: car.name,
      url: car.url,
    }));

    addDoc(collection(db, "cars"), {
      name: data.name,
      model: data.model,
      whatsapp: data.whatsapp,
      year: data.year,
      city: data.city,
      km: data.km,
      price: data.price,
      description: data.description,
      created: new Date(),
      owner: user?.name,
      userUid: user?.uid,
      images: carImages,
    })
    .then(() => {
      toast.success("Cadastrado com sucesso");
      reset();
      setImages([]);
    })
    .catch(() => {
      toast.error("Erro ao cadastrar carro");
    })
    

  }

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const image    = e.target.files[0]
      const uidImage = uuidV4();

      if (image.type === 'image/jpeg' || image.type === 'image/png') {
        const imageItem = {
          name: image?.name,
          uid: uidImage,
          previewUrl: URL.createObjectURL(image),
          url: null,
          file: image
        }

        setImages((images) => [...images, imageItem])

      } else {
        alert("Envie uma imagem JPEG ou PNG")
        return;
      }
    }
  }

  async function handleImageUpload(imagesList: ImageProps[]): Promise<ImageProps[]> {
    if (!user?.uid) {
      return [];
    }
  
    const currentUid = user.uid;
  
    const uploadPromises = imagesList.map(async (image) => {
      const uploadRef = ref(storage, `images/${currentUid}/${image.uid}`);
      const snapshot = await uploadBytes(uploadRef, image.file);
      const downloadUrl = await getDownloadURL(snapshot.ref);
  
      return {
        ...image,
        url: downloadUrl,
      };
    });
  
    const updatedImages = await Promise.all(uploadPromises);
  
    setImages(updatedImages); 
    return updatedImages; 
  }

  function handleDeleteImage(itemUid: string | null) {
    const confirmed = window.confirm('Tem certeza que deseja excluir esta imagem?');
    if (confirmed) {
      setImages((prevImages) => prevImages.filter((image) => image.uid !== itemUid));
    }
  }

  return (
    <Container>
      <DashHeader />

      <div className="w-full bg-white p-7 rounded-lg flex flex-col items-center gap-2">
        
        <div className="w-full md:w-2/3 flex flex-col items-center">
          <label className="text-xl font-bold text-gray-900 mb-7">
            Adicione as fotos do veículo
          </label>

          <div className={`w-full h-full grid gap-4 ${images.length === 0 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center'}`}>
            <label htmlFor="file-upload" className="w-full h-40 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 cursor-pointer">
              <div className="text-center">
                <FiImage size={30} color="#d1d5db" className="mx-auto" aria-hidden="true"/>
                <div className="mt-4 flex text-sm/6 text-gray-600">
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFile} />
                  <p className="pl-1 mx-auto text-xs">Selecione</p>
                </div>
                <p className="text-xs/5 text-gray-600">PNG ou JPG</p>
              </div>
            </label>

            {images.map( item => (
              <div key={item.name} className="w-full h-full flex items-center justify-center relative group">
                <img src={item.previewUrl} className="rounded-lg w-full h-40 object-cover" alt={item.name} />
                <div className="absolute inset-0 bg-black opacity-15 group-hover:opacity-35 rounded-md pointer-events-none transition-opacity duration-300"></div>
                <button className="absolute inset-0 flex items-center justify-center z-20" onClick={() => handleDeleteImage(item.uid)}>
                  <FiTrash size={28} color="#fff" />
                </button>
              </div>
            ))}
          </div>

        </div>
      </div>
        
      <div className="w-full bg-white p-7 rounded-lg flex flex-col items-center gap-2 mt-2">
          <label className="text-xl font-bold text-gray-900 mb-5">
            Especificações do veículo 
          </label>

        <form className="w-full md:w-2/3" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-7">
            <p className="text-base/4 font-medium text-gray-900 mb-4">Nome do Carro</p>
            <Input type="text" register={register} name="name" error={errors.name?.message} placeholder="Ex: Onix 1.0..." />
          </div>
          
          <div className="mb-7">
            <p className="text-base/4 font-medium text-gray-900 mb-4">Modelo do Carro</p>
            <Input type="text" register={register} name="model" error={errors.model?.message} placeholder="Ex: 1.0 Flex Manual..." />
          </div>
          
          <div className="mb-7">
            <p className="text-base/4 font-medium text-gray-900 mb-4">Preço</p>
            <Input type="text" register={register} name="price" error={errors.price?.message} placeholder="Ex: 1.0 Flex Manual..." />
          </div>

          <div className="flex w-full mb-7 flex-row items-start sm:items-center gap-2 md:gap-4">
            <div className="w-full">
              <div>
                <p className="text-base/4 font-medium text-gray-900 mb-4">Ano do Carro</p>
                <Input type="text" register={register} name="year" error={errors.year?.message} placeholder="Ex: 2020/2020" />
              </div>
            </div>

            <div className="w-full">
              <div>
                <p className="text-base/4 font-medium text-gray-900 mb-4">KM Rodados</p>
                <Input type="text" register={register} name="km" error={errors.km?.message} placeholder="Ex: 25.000 km" />
              </div>
            </div>  
          </div>
          
          <div className="flex w-full mb-7 flex-row items-start sm:items-center gap-4">
            <div className="w-full">
              <div>
                <p className="text-base/4 font-medium text-gray-900 mb-4">Telefone / Whatsapp</p>
                <Input type="text" register={register} name="whatsapp" error={errors.whatsapp?.message} placeholder="Ex: 011 9999 9999" />
              </div>
            </div>

            <div className="w-full">
              <div>
                <p className="text-base/4 font-medium text-gray-900 mb-4">Cidade</p>
                <Input type="text" register={register} name="city" error={errors.city?.message} placeholder="Ex:São Paulo" />
              </div>
            </div>  
          </div>

          <div className="mb-7">
            <p className="text-base/4 font-medium text-gray-900 mb-4">Descrição</p>
            <textarea 
             className="border-2 w-full rounded-md h-24 px-2" {...register("description")} name="description" id="description" placeholder="Digite a descrição completa do caro..." />
            {errors.description && <p className="mb-1 text-red-500" >{errors.description.message}</p>}
          </div>
          
          <button type="submit" className="w-full md:w-1/3 h-10 rounded-md bg-zinc-900 text-white font-medium">Cadastrar</button>
        </form>

      </div>
    </Container>
  )
}
