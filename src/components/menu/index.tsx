import React from 'react'
import { Container } from './styles'
import { useRouter } from 'next/router'
import { Logo } from '../logo'
import Link from 'next/link'
import _ from 'lodash'

export function Menu(props: any) {

    const { route } = useRouter()

    const navigation = [
        { icon: 'fa-solid fa-house', label: 'Página inicial', route: '/home' },
        { icon: 'fa-solid fa-calendar-week', label: 'Agendamentos', route: '/calendar' },
        { icon: 'fa-solid fa-users', label: 'Meus clientes', route: '/customer' },
    ]

    return (
        <Container>
            <div>
                <header>
                    <Logo size="1.3rem" />
                </header>
                <nav>
                    <ul>
                        {_.map(navigation, (data, index) =>
                            <li key={index}>
                                <Link href={data.route}>
                                    <div className={`nav-item ${_.includes(route, data.route) ? 'target' : ''}`}>
                                        <div>
                                            <i className={data.icon} />
                                        </div>
                                        <div>
                                            {data.label}
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        )}
                    </ul>
                </nav>
            </div>
            <footer>
            </footer>
        </Container>
    )
}