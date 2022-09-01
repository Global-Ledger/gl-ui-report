import { AbilityBuilder, Ability } from '@casl/ability'

export default function defineAbilityFor(coin = 'tx') {
    const { can, rules } = new AbilityBuilder(Ability);

    // defined permissions
    if (coin === 'tx') {
        can(['use'], 'btc')
    }

    if (coin === 'ethVision') {
        can(['use'], 'eth')
    }

    return new Ability(rules);
}