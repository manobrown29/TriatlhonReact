import "./footer.css"

export default function index() {
  return (
    <footer className="dashboard-footer">
        <div className="footer-content">
            <div className="footer-brand">
            <h4>Meu Triathlon HUB</h4>
            <p>Acompanhamento e métricas de desempenho em Triathlon Sprint.</p>
            </div>
            
            <div className="footer-badge">
            <span>Sprint: 750m Natação • 20km Ciclismo • 5km Corrida</span>
            </div>
        </div>

        <div className="footer-bottom">
            <p> Meu Triathlon HUB. Todos os direitos reservados.</p>
        </div>
    </footer>
  )
}