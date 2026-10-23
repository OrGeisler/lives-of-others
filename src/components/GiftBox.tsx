import '../styles/giftbox.css'

// 22.10: a dog popping out of a gift box (gift page banner + home gift banner). CSS only; still when motion is reduced.
export default function GiftBox({ img = '/assets/img/gift-dog-junior.jpg', alt = 'כלב קופץ מתוך קופסת מתנה' }: { img?: string; alt?: string }) {
  return (
    <div className="gbox" role="img" aria-label={alt}>
      <span className="gbox-spark s1" aria-hidden="true">✦</span>
      <span className="gbox-spark s2" aria-hidden="true">✦</span>
      <span className="gbox-spark s3" aria-hidden="true">✦</span>
      <img className="gbox-dog" src={img} alt="" />
      <div className="gbox-lid" aria-hidden="true"><span className="gbox-bow" /></div>
      <div className="gbox-body" aria-hidden="true" />
    </div>
  )
}
