import "./header.css"
import logoTipo from "../../assets/logotipo.jpg"

export default function index() {
  return (
      <div className="container-header">
          <img className="img-logo" src={logoTipo}/>
          <div className="header-text">
              <h1>Meu Triatlhon HUB</h1>
              <p>Provas e Métricas pessoais</p>
          </div>
      </div>
  )
}