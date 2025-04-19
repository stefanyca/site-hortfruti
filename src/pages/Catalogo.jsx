import React, { useState, useEffect } from "react";
import { db } from "./firebase"; // ajuste conforme a configuração do seu firebase
import { collection, onSnapshot } from "firebase/firestore";

function Catalogo() {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    const produtosCollection = collection(db, 'produtos');

    // Escuta as mudanças em tempo real no Firestore
    const unsubscribe = onSnapshot(produtosCollection, (snapshot) => {
      const produtosList = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          nome: data.nome,
          preco: data.preco,
          imagem: data.imagem,
        };
      });

      setProdutos(produtosList);
    });

    // Limpa o listener quando o componente for desmontado
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h1>Catálogo de Produtos 🍎</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {produtos.length === 0 ? (
          <p>Carregando produtos...</p>
        ) : (
          produtos.map((produto) => (
            <div
              key={produto.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "15px",
                width: "200px",
                textAlign: "center",
              }}
            >
              <img
                src={produto.imagem}
                alt={produto.nome}
                style={{ width: "100%", borderRadius: "8px" }}
              />
              <h3>{produto.nome}</h3>
              <p>R$ {produto.preco.toFixed(2)}</p>
              <button
                style={{
                  background: "#4caf50",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Adicionar ao Carrinho
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Catalogo;
