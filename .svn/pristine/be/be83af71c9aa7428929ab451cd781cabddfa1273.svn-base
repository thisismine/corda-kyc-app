package com.capgemini.kycapp.contract;

import static java.util.stream.Collectors.toList;
import com.capgemini.kycapp.model.UserKycInfo;
import java.lang.reflect.Constructor;
import java.security.PublicKey;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import net.corda.core.contracts.Command;
import net.corda.core.contracts.DealState;
import net.corda.core.contracts.TransactionType;
import net.corda.core.contracts.UniqueIdentifier;
import net.corda.core.crypto.CompositeKey;
import net.corda.core.crypto.Party;
import net.corda.core.transactions.TransactionBuilder;

import com.capgemini.kycapp.contract.KycContract.Commands.Place;
import java.security.PublicKey;
import java.util.*;
import com.capgemini.kycapp.model.UserKycInfo;
import static java.util.stream.Collectors.toList;

// TODO: Implement QueryableState and add ORM code (to match Kotlin example).

/**
 * The state object that we will use to record the agreement of a valid purchase order issued by a buyer to a seller.
 *
 * There are a few key state interfaces, the most fundamental of which is [ContractState]. We have defined other
 * interfaces for different requirements. In this case, we are implementing a [DealState] which defines a few helper
 * properties and methods for managing states pertaining to deals.
 */
public class KycState implements DealState
{
    private final UserKycInfo userKycInfo;
    private final Party buyer;
    private final KycContract contract;
    private final UniqueIdentifier linearId;
    private final List<Party> otherParties;


    public KycState(UserKycInfo userKycInfo,
                    Party buyer,
                    List<Party> otherParties,
                    KycContract contract)
    {
        this.userKycInfo = userKycInfo;
        this.buyer = buyer;
        this.otherParties = otherParties;
        this.contract = contract;
        this.linearId = new UniqueIdentifier(
                Integer.toString(userKycInfo.getUserId()),
                UUID.randomUUID());
    }

    public List<Party> getOtherParties() {
        return otherParties;
    }

    public UserKycInfo getUserKycInfo() { return userKycInfo; }
    public Party getBuyer() { return buyer; }


    @Override public KycContract getContract() { return contract; }
    @Override public UniqueIdentifier getLinearId() { return linearId; }
    @Override public String getRef() { return linearId.getExternalId(); }

    @Override
    public List<Party> getParties()
    {
        List<Party> temp = new ArrayList<Party>();
        temp.addAll(getOtherParties());
        temp.add(buyer);
        return temp;
        //return Arrays.asList(buyer, seller, thirdPartyC);
    }


    @Override
    public List<CompositeKey> getParticipants() {
        return getParties()
                .stream()
                .map(Party::getOwningKey)
                .collect(toList());
    }

    /**
     * This returns true if the state should be tracked by the vault of a particular node. In this case the logic is
     * simple; track this state if we are one of the involved parties.
     */
    @Override
    public boolean isRelevant(Set<? extends PublicKey> ourKeys) {
        final List<PublicKey> partyKeys = getParties()
                .stream()
                .flatMap(party -> party.getOwningKey().getKeys().stream())
                .collect(toList());
        return ourKeys
                .stream()
                .anyMatch(partyKeys::contains);

    }

    /**
     * Helper function to generate a new Issue() purchase order transaction. For more details on building transactions
     * see the API for [TransactionBuilder] in the JavaDocs.
     * https://docs.corda.net/api/net.corda.core.transactions/-transaction-builder/index.html
     */
    @Override
    public TransactionBuilder generateAgreement(Party notary)
    {
        //Compile time ERROR in Eclipse
    	/*return new TransactionType.General.Builder(notary)
                .withItems(this, new Command(new KycContract.Commands.Place(), getParticipants()));*/
    	Class memberClasses[] = TransactionType.General.class.getDeclaredClasses();    	
    	
    	Class classDefinition = memberClasses[0];
    	
    	TransactionBuilder builder = null;
    	try{
    		Constructor cons = classDefinition.getConstructor(Party.class);    		
    		Object obj = cons.newInstance(notary);
    		
    		TransactionBuilder tempBuilder = (TransactionBuilder) obj;
    		builder = tempBuilder.withItems(this, new Command(new Place(), getParticipants()));
    		
    		
    	}catch(Exception e){
    		e.printStackTrace();
    	} 
    	
    	return builder; 
    }
}