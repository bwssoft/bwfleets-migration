interface ViacepAddress {
  bairro: string;
  cep: string;
  complemento: string;
  ddd: string;
  estado: string;
  gia: string;
  ibge: string;
  localidade: string;
  logradouro: string;
  regiao: string;
  siafi: string;
  uf: string;
  unidade: string;
}

export async function findAddressByPostalCode(
  postalCode: string
): Promise<ViacepAddress> {
  const response = await fetch(`https://viacep.com.br/ws/${postalCode}/json/`);
  return response.json();
}
