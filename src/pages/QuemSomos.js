import React from "react";

function QuemSomos() {
  return (
    <section id="sobre" className="px-8 pt-32 pb-20 bg-white border-t border-gray-200">
      <h3 className="text-3xl font-bold text-green-900 text-center mb-10">
        Quem somos
      </h3>
      <div className="flex flex-col md:flex-row items-center max-w-5xl mx-auto gap-10">
        <img
          src="/dona-lourdes.jpg"
          alt="Dona Lourdes"
          className="w-72 h-auto rounded-xl shadow-lg"
        />
        <div className="text-base text-gray-700">
          <p className="mb-4">
            O Armazém Dona Lourdes nasceu em <strong>1967</strong>, em Loanda-PR, com o sonho e a força de Dona Lourdes, que acreditava no poder da terra e da união da comunidade.
          </p>
          <p className="mb-4">
            Desde o início, a base foi a <strong>agricultura familiar</strong> — cultivada com amor, sem pressa e com o cuidado que só quem planta e colhe com as próprias mãos conhece.
          </p>
          <p>
            Hoje, seguimos com o legado que ela deixou: valorizar os pequenos produtores e entregar comida de verdade, cheia de história e propósito.
          </p>
        </div>
      </div>
    </section>
  );
}

export default QuemSomos;
