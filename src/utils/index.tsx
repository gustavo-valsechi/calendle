import _ from "lodash"

export default class Refactoring {
    static format = {
        stringLimit(value: string, limit: number) {
            if (!value) return ''

            if (value.length <= (limit)) return value

            return value.substring(0, limit) + '...'
        },

        address(data: any) {
            if (!data) return ''

            return `${data.city} - ${data.state} / ${data.address}`
        },

        match(value: any) {
            if (!value) return ''

            if (Number(value.replace(/\D/g, ""))) return String(value)

            if (typeof value !== 'string') {
                return _.map(value, (data) => data.normalize("NFD").replace(/[^a-zA-Z\s]/g, "").toUpperCase())
            }

            return value.normalize("NFD").replace(/[^a-zA-Z\s]/g, "").toUpperCase()
        },
    }

    static mask = {
        docNumber: (value: any) => {
            if (!value) return ''

            value = this.removeMask.docNumber(value)

            if (value.length <= 11) {
                return value
                    .replace(/\D/g, "")
                    .replace(/(\d{3})(\d)/, "$1.$2")
                    .replace(/(\d{3})(\d)/, "$1.$2")
                    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
                    .replace(/(-\d{2})\d+?$/, "$1")
            }
            return value
                .replace(/\D/g, "")
                .replace(/(\d{2})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d{1,2})/, "$1/$2")
                .replace(/(\d{4})(\d{1,2})/, "$1-$2")
                .replace(/(-\d{2})\d+?$/, "$1")
        },
        phone: (value: any) => {
            if (!value) return ''

            if (value.length === 14 || value.length === 10) {
                return value
                    .replace(/\D/g, "")
                    .replace(/(\d{2})(\d)/, "($1) $2")
                    .replace(/(\d{4})(\d)/, "$1-$2")
                    .replace(/(-\d{4})(\d+?$)/, "$1")
            }

            return value
                .replace(/\D/g, "")
                .replace(/(\d{2})(\d)/, "($1) $2")
                .replace(/(\d{5})(\d)/, "$1-$2")
                .replace(/(-\d{4})\d+?$/, "$1")
        },
        percent: (value: any) => {
            if (!value) return ''

            value = value.replace(/\D-+/g, "")

            if (value.length > 2) {
                value = String((value * 100)).replace(/([0-9]{2})$/g, ",$1")
            }

            return value
        },
        money(valor: any, nosign: boolean, integer: boolean) {
            valor = valor + ""
            valor = parseInt(valor.replace(/[\D]+/g, ""))

            if (!nosign) valor = "R$ " + valor

            if (!integer) {
                if (!nosign ? valor.length <= 4 : valor.length <= 1) {
                    valor = valor.replace(/([0-9]{1})$/g, "00$1")
                }

                if (!nosign ? valor.length <= 5 : valor.length <= 2) {
                    valor = valor.replace(/([0-9]{2})$/g, "0$1")
                }

                if (!nosign ? valor.length > 5 : valor.length > 2) {
                    valor = valor.replace(/([0-9]{2})$/g, ",$1")
                }

                if (!nosign ? valor.length > 9 : valor.length > 6) {
                    valor = valor.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2")
                }

                if (!nosign ? valor.length > 13 : valor.length > 10) {
                    valor = valor.replace(/([0-9]{3}).([0-9]{3}),([0-9]{2}$)/g, ".$1.$2,$3")
                }

                if (!nosign ? valor.length > 17 : valor.length > 14) {
                    valor = valor.replace(/([0-9]{3}).([0-9]{3}).([0-9]{3}),([0-9]{2}$)/g, ".$1.$2.$3,$4")
                }
            } else {

                if (!nosign ? valor.length > 6 : valor.length > 3) {
                    valor = valor.replace(/([0-9]{3}$)/g, ".$1")
                }

                if (!nosign ? valor.length > 10 : valor.length > 7) {
                    valor = valor.replace(/([0-9]{3}).([0-9]{3}$)/g, ".$1.$2")
                }

                if (!nosign ? valor.length > 14 : valor.length > 11) {
                    valor = valor.replace(/([0-9]{3}).([0-9]{3}).([0-9]{3}$)/g, ".$1.$2.$3")
                }
            }

            if (valor === "R$ NaN") return ""
            if (valor === "R$ 0,00") return ""

            return valor.substring(0, 20)
        },
        number: (value: any) => {
            if (!value) return ''

            return value.replace(/\D/g, '')
        }
    }

    static removeMask = {
        phone: (value: any) => {
            if (!value) return ''

            return value
                .replace("(", "")
                .replace(")", "")
                .replace(" ", "")
                .replace("-", "")
        },
        docNumber: (value: any) => {
            if (!value) return ''

            return value
                .replace(/\./g, "")
                .replace("/", "")
                .replace("-", "")
        },
        percent: (value: any) => {
            if (!value) return ''

            return value.replace(',', '.').replace('%', '')
        },
        money: (value: any) => {
            if (!value) return ''

            return value.replace('R$', '').replace(/\./g, '').replace(',', '.')
        },
        number: (value: any) => {
            if (!value) return ''

            return value.replace(/\D/g, '')
        }
    }

    static template = {
        name: (data: any) => {
            if (!data?.length) return

            return `${data[0]?.name}${data?.length > 1 ? ` + ${data?.length - 1}` : ''}`
        }
    }

    static theme = {
        toggle: (theme: string) => {
            if (!theme) return

            const themeContent = {
                light: () => {
                    document.body.style.setProperty("--primary", "#fff")
                    document.body.style.setProperty("--secondary", "#5869da")
                    document.body.style.setProperty("--tertiary", "rgb(98, 157, 253, 0.2)")
                    document.body.style.setProperty("--label", "rgb(0, 0, 0, 0.6)")
                    document.body.style.setProperty("--label-hover", "rgb(0, 0, 0, 0.8)")
                    document.body.style.setProperty("--transparent", "rgb(0, 0, 0, 0.05)")
                    document.body.style.setProperty("--transparent-blur", "rgb(255, 255, 255, 0.4)")
                    document.body.style.setProperty("--input-border", "rgb(0, 0, 0, 0.2)")
                    document.body.style.setProperty("--input-background", "#fff")
                    document.body.style.setProperty("--positive", "#65c965")
                    document.body.style.setProperty("--negative", "#FF334E")
                },
                dark: () => {
                    document.body.style.setProperty("--primary", "#333")
                    document.body.style.setProperty("--secondary", "#5869da")
                    document.body.style.setProperty("--tertiary", "rgb(98, 157, 253, 0.2)")
                    document.body.style.setProperty("--label", "rgb(255, 255, 255, 0.6)")
                    document.body.style.setProperty("--label-hover", "rgb(255, 255, 255, 0.8)")
                    document.body.style.setProperty("--transparent", "rgb(255, 255, 255, 0.05)")
                    document.body.style.setProperty("--transparent-blur", "rgb(0, 0, 0, 0.2)")
                    document.body.style.setProperty("--input-border", "rgb(255, 255, 255, 0.2)")
                    document.body.style.setProperty("--input-background", "transparent")
                    document.body.style.setProperty("--positive", "#65c965")
                    document.body.style.setProperty("--negative", "#FF334E")
                }
            }

            return themeContent[theme]()
        }
    }
}