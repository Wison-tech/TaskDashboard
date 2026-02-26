import UIKit

/**
 * AVATAR VIEW (Capa de UI Nativa - Swift)
 * * Renderiza un círculo con iniciales y color determinista.
 * * Lógica Senior:
 * 1. Optimización de Layout: Usa 'layoutSubviews' para garantizar que el círculo 
 * sea perfecto independientemente del tamaño del frame enviado desde JS.
 * 2. Procesamiento de Texto: Limpieza de strings y extracción de iniciales eficiente.
 */
@objc(AvatarView)
class AvatarView: UIView {
  
  private let label = UILabel()
  
  @objc var name: String = "" {
    didSet {
      updateAvatar()
    }
  }

  override init(frame: CGRect) {
    super.init(frame: frame)
    setupView()
  }

  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  private func setupView() {
    label.textColor = .white
    label.textAlignment = .center
    label.font = UIFont.boldSystemFont(ofSize: 18)
    label.adjustsFontSizeToFitWidth = true
    addSubview(label)
    
    // Configuración inicial del círculo
    self.clipsToBounds = true
    self.backgroundColor = .lightGray
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    // Asegura que sea un círculo perfecto basado en el frame dinámico de RN
    self.layer.cornerRadius = self.frame.width / 2
    label.frame = self.bounds
  }

  private func updateAvatar() {
    // Extracción de iniciales (Máximo 2)
    let parts = name.components(separatedBy: " ").filter { !$0.isEmpty }
    let initials = parts.prefix(2).map { String($0.prefix(1)).uppercased() }.joined()
    
    label.text = initials.isEmpty ? "?" : initials
    
    // Generación de color determinista basado en el hash del nombre
    self.backgroundColor = generateColor(from: name)
  }

  private func generateColor(from text: String) -> UIColor {
    let hash = text.hashValue
    let r = CGFloat((hash & 0xFF0000) >> 16) / 255.0
    let g = CGFloat((hash & 0x00FF00) >> 8) / 255.0
    let b = CGFloat(hash & 0x0000FF) / 255.0
    return UIColor(red: r, green: g, blue: b, alpha: 1.0)
  }
}