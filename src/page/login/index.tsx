import { Link } from 'react-router-dom';
import logoImg from '../../assets/img/logo.svg';
import { Container } from '../../components/container';
import { Input } from '../../components/input';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  email: z.string().email("Insira um email válido").min(1, "O campo email é obigatório"),
  password: z.string().min(1, "O campo senha é obrigatório")
})

type FormData = z.infer<typeof schema>

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onSubmit"
  })

  function onSubmit(data: FormData) {
    console.log(data);
  }


  return (
    <Container>
      <div className="w-full min-h-screen flex justify-center items-center flex-col gap-4">
        <Link to="/" className="mb-6 max-w-sm w-full">
          <img src={logoImg} alt="Logo do Site" className="w-full"/>
        </Link>

        <form 
          className="bg-white max-w-xl w-full rounded-lg p-4"
          onSubmit={handleSubmit(onSubmit)}  
        >
          <div className="mb-3">
            <Input 
              type="email"
              placeholder="Digite seu email..."
              name="email"
              register={register}
              error={errors.email?.message}
            />
          </div>
          
          <div className="mb-3">
            <Input 
              type="password"
              placeholder="Digite sua senha..."
              name="password"
              register={register}
              error={errors.password?.message}
            />
          </div>

          <button
            type="submit"
            className="bg-zinc-900 w-full rounded-md text-white h-10 font-medium hover:bg-zinc-700 transition-all"
          >
            Acessar
          </button>

        </form>
      </div>
    </Container>
  )
}
