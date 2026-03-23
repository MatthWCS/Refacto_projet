import './Footer.scss'

export const Footer = () => {

    return (
        <>
            <footer id='main_footer' className="footer sm:footer-horizontal footer-center bg-neutral text-neutral-content p-10">
                <aside>
                    <p>Copyright © {new Date().getFullYear()} - All right reserved by Me</p>
                </aside>
                <aside>
                    <p>
                        Vous êtes au pied du mur !
                        <br />
                        L'Hiver vient !
                    </p>
                </aside>
            </footer>
        </>
    )
}