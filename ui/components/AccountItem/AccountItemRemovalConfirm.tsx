import { removeAccount } from "@tallyho/tally-background/redux-slices/accounts"
import {
  AccountTotal,
  selectKeyringByAddress,
} from "@tallyho/tally-background/redux-slices/selectors"
import { HexString } from "@tallyho/tally-background/types"
import React, { ReactElement } from "react"
import { useDispatch } from "react-redux"
import SharedButton from "../Shared/SharedButton"
import RemoveAddressLabel from "./AccountItemRemoveAddressLabel"
import SharedAccountItemSummary from "../Shared/SharedAccountItemSummary"
import { useBackgroundSelector } from "../../hooks"

interface AccountItemRemovalConfirmProps {
  account: AccountTotal
  address: HexString
  isSelected: boolean
  close: () => void
}

const RegularWarning: React.FC = () => (
  <span>
    Removing this address doesn&apos;t delete your recovery phrase or any
    private keys. Instead it just hides it from the extension and you won&apos;t
    be able to use it until you add it back.
  </span>
)

const LoudWarning: React.FC = () => (
  <span>
    <h3>
      Removing this address will remove its associated account from the UI.
    </h3>{" "}
    Are you sure you want to proceed?
  </span>
)

export default function AccountItemRemovalConfirm({
  account,
  address,
  isSelected,
  close,
}: AccountItemRemovalConfirmProps): ReactElement {
  const dispatch = useDispatch()
  const keyring = useBackgroundSelector(selectKeyringByAddress(address))
  const onlyOneAddressVisible = keyring?.addresses.length === 1
  return (
    <div className="remove_address_option">
      <div className="header">
        <RemoveAddressLabel />
      </div>
      <ul>
        <li className="account_container">
          <li className="standard_width">
            <SharedAccountItemSummary
              accountTotal={account}
              isSelected={isSelected}
            />
          </li>
        </li>
      </ul>
      <div className="remove_address_details">
        {onlyOneAddressVisible ? <LoudWarning /> : <RegularWarning />}
      </div>
      <div className="button_container">
        <SharedButton
          type="secondary"
          size="medium"
          onClick={(e) => {
            e.stopPropagation()
            close()
          }}
        >
          Cancel
        </SharedButton>
        <SharedButton
          type={onlyOneAddressVisible ? "warning" : "primary"}
          size="medium"
          onClick={(e) => {
            e.stopPropagation()
            dispatch(removeAccount(address))
            close()
          }}
        >
          Yes, I want to remove it
        </SharedButton>
      </div>
      <style jsx>{`
        li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 0 auto;
          width: 336px;
          height: 52px;
        }
        .header {
          height: 24px;
        }
        .remove_address_option {
          margin-left: 20px;
          margin-right: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 95%;
        }
        .remove_address_details {
          display: flex;
          flex-direction: column;
          line-height: 24px;
          font-size 16px;
        }
        .button_container {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }
        .account_container {
          margin-top: -10px;
          background-color: var(--hunter-green);
          padding: 5px;
          border-radius: 16px;
        }
      `}</style>
    </div>
  )
}
