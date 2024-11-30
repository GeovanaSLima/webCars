import { Link, useNavigate } from 'react-router-dom';
import logoImg from '../../assets/img/logo.svg';
import { Container } from '../../components/container';
import { Input } from '../../components/input';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { auth } from '../../services/firebaseConnection';
import { useEffect } from 'react';

const schema = z.object({
  name: z.string().min(1, "O campo nome é obrigatório"),
  email: z.string().email("Insira um email válido").min(1, "O campo email é obigatório"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres").min(1, "O campo senha é obrigatório"),
})

type FormData = z.infer<typeof schema>

export default function Register() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange"
  })

  useEffect(() => {
    async function handleLogout() {
      await signOut(auth)
    }

    handleLogout();
  }, [])

  async function onSubmit(data: FormData) {
    createUserWithEmailAndPassword(auth, data.email, data.password)
    .then(async (user) => {
      await updateProfile(user.user, {
        displayName: data.name
      })

      console.log("Cadastrado com sucesso")

      navigate("/dashboard", { replace: true })
    })
    .catch((error) => {
      console.log("Erro ao cadastrar o usuário", error)
    })
  }


  return (
    <Container>
      <div className="w-full min-h-screen flex justify-center items-center flex-col gap-4">
        <Link to="/" className="mb-6 max-w-sm w-full">
          <img src={logoImg} alt="Logo do Site" className="w-full"/>
        </Link>

        <form 
          className="bg-white max-w-lg w-full rounded-lg p-4"
          onSubmit={handleSubmit(onSubmit)}  
        >
          <div className="mb-3">
            <Input 
              type="text"
              placeholder="Digite seu nome completo..."
              name="name"
              register={register}
              error={errors.name?.message}
            />
          </div>

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
            Cadastrar
          </button>

        </form>

        <Link 
          to="/login"
          className="font-light text-sm text-zinc-500 hover:text-zinc-700 transition-all"
        >
          Já possui uma conta? Faça o login
        </Link>
      </div>
    </Container>
  )
}
