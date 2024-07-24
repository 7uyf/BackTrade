from server.models.option import Option


def get_dict_key(option: Option) -> str:
    strike = option.strike
    right = option.call_put
    expiration_date = option.expiration_date.strftime('%Y-%m-%d')
    symbol = option.stock_symbol
    key = f"{strike}_{right}_{expiration_date}_{symbol}"
    return key



