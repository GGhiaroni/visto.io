import { Loader2, Lock, LogIn, Mail, UserPlus } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { useAuthStore } from "../store/authStore";

const Login = () => {
  const { loginWithPassword, registerWithPassword } = useAuthStore();

  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) return toast.warning("Preencha todos os campos.");

    setIsLoading(true);

    if (isRegistering) {
      const { error } = await registerWithPassword(email, password);

      if (error) {
        toast.error("Erro ao criar conta. " + error.message);
      } else {
        toast.success(
          "Conta criada com sucesso. Verifique o seu e-mail para confirmar."
        );
        setIsRegistering(false);
      }
    } else {
      const { error } = await loginWithPassword(email, password);

      if (error) {
        toast.error("E-mail ou senha incorretos.");
      } else {
        toast.success("Bem-vindo de volta!");
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-white shadow-xl border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            {isRegistering ? "Criar nova conta" : "Acesse sua conta"}
          </h1>
          <p className="text-slate-500">
            {isRegistering
              ? "Comece a fazer vistorias hoje."
              : "Bem-vindo ao Visto.io"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <Input
                type="email"
                placeholder="seunome@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <Input
                type="password"
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
                minLength={6}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-base gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isRegistering ? (
              <>
                {" "}
                <UserPlus className="h-4 w-4" /> Cadastrar{" "}
              </>
            ) : (
              <>
                {" "}
                <LogIn className="h-4 w-4" /> Entrar{" "}
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-sm text-primary hover:underline font-medium"
          >
            {isRegistering
              ? "Já tem uma conta? Faça login."
              : "Não tem conta? Cadastre-se."}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Login;
