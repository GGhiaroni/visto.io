export interface ViaCepResponse {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export async function fetchAddressByCep(
  cep: string
): Promise<ViaCepResponse | null> {
  const cleanCep = cep.replace(/\D/g, "");

  if (cleanCep.length !== 8) {
    throw new Error("O CEP deve conter 8 dígitos.");
  }

  const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);

  if (!response.ok) {
    throw new Error("Erro ao conectar o serviço do ViaCep.");
  }

  const data: ViaCepResponse = await response.json();

  if (data.erro) {
    return null;
  }

  return data;
}
