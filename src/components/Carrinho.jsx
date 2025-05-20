import { useContext } from "react";
import { CarrinhoContext } from "../context/CarrinhoContext";

function Carrinho() {
  const { carrinho, removerDoCarrinho, valorTotal, limparCarrinho } = useContext(CarrinhoContext);

  return (
    <div>
      <h2>🛒 Carrinho de Compras</h2>
      {carrinho.length === 0 ? (
        <p>O carrinho está vazio.</p>
      ) : (
        <ul>
          {carrinho.map((item, index) => (
            <li key={index}>
              {item.nome} - R${item.preco.toFixed(2)}{" "}
              <button onClick={() => removerDoCarrinho(item.id)}>Remover</button>
            </li>
          ))}
        </ul>
      )}
      <p>Total: R${valorTotal.toFixed(2)}</p>
      {carrinho.length > 0 && (
        <button onClick={limparCarrinho}>Limpar Carrinho</button>
      )}
    </div>
  );
}

export default Carrinho;
